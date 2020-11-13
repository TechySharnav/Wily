import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Stylesheet,
  TextInput,
  ToastAndroid,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as firebase from "firebase";
import db from "../config.js";

export default class bookTransactionScreen extends Component {
  constructor() {
    super();

    this.state = {
      hasCameraPermission: true,
      isScanned: false,
      buttonState: "normal",
      buttonID: "",
      studentID: "",
      bookID: "",
      transactionMsg: "",
    };
  }

  getCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted",
    });
  };

  handleBarcodeScan = (res) => {
    if (this.state.buttonID === "bookID") {
      this.setState({
        isScanned: false,
        bookID: res.data,
        buttonState: "normal",
      });
    } else if (this.state.buttonID === "studentID") {
      this.setState({
        isScanned: false,
        studentID: res.data,
        buttonState: "normal",
      });
    }
  };

  handleTransaction = async () => {
    var message = "";
    console.log("HandleTransaction Called.");
    {
      /*db.collection("books")
      .doc(this.state.bookID)
      .get()
      .then((doc) => {
        var book = doc.data();
        if (book.bookAvailability) {
          this.initiateBookIssue();
          message = "Book Issued";
        } else if (book.bookAvailability === false) {
          this.initiateBookReturn();
          message = "Book Returned";
        }
      });
    this.setState({ transactionMsg: message });*/
    }

    var transactionType = await this.checkBookEligibility();
    console.log(transactionType, "This is trasaction Type");
    if (transactionType === null) {
      Alert.alert("Book doesn't Exist in Library");
      this.setState({ bookID: "", studentID: "" });
    } else if (transactionType === true) {
      var studentEligibility = await this.checkStudentEligibilityforBookIssue();
      if (studentEligibility === null) {
        Alert.alert("Student Doesn't Exists");
      } else if (studentEligibility === true) {
        this.initiateBookIssue();
      } else {
        Alert.alert("Maxmimum Limit of Books Reached");
      }
    } else if (transactionType === false) {
      var studentEligibility = await this.checkStudentEligibilityforBookReturn();
      studentEligibility
        ? this.initiateBookReturn()
        : Alert.alert("This Book was not Issued to this student to return");
    }
  };

  checkStudentEligibilityforBookReturn = async () => {
    var temp = null;
    var bookRef = await db
      .collection("transaction")
      .where("bookID", "==", this.state.bookID)
      .limit(1)
      .get();

    bookRef.docs.map((doc) => {
      var bookData = doc.data();
      if (bookData.studentID === this.state.studentID) {
        temp = true;
      } else {
        temp = false;
      }
    });
    return temp;
  };

  checkStudentEligibilityforBookIssue = async () => {
    var temp = null;
    var studentRef = await db
      .collection("students")
      .where("studentID", "==", this.state.studentID)
      .get();
    if (studentRef.docs.length === 0) {
      this.setState({ bookID: "", studentID: "" });
      temp = null;
    } else {
      studentRef.docs.map((doc) => {
        var studentData = doc.data();
        if (studentData.booksIssued < 2) {
          temp = true;
        } else {
          this.setState({ bookID: "", studentID: "" });
          temp = false;
        }
      });
    }
    return temp;
  };

  checkBookEligibility = async () => {
    var TemptransactionType = null;
    const bookRef = await db
      .collection("books")

      .where("bookID", "==", this.state.bookID)
      .get();

    if (bookRef.docs.length === 0) {
      TemptransactionType = null;
    } else {
      bookRef.docs.map((doc) => {
        var bookData = doc.data();
        if (bookData.bookAvailability) {
          TemptransactionType = true;
        } else {
          TemptransactionType = false;
        }
      });
    }
    return TemptransactionType;
  };

  initiateBookIssue = async () => {
    console.log("BookIssue Called.");
    db.collection("transaction").add({
      studentID: this.state.studentID,
      bookID: this.state.bookID,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "Issued",
    });

    db.collection("books").doc(this.state.bookID).update({
      bookAvailability: false,
    });

    db.collection("students")
      .doc(this.state.studentID)
      .update({
        booksIssued: firebase.firestore.FieldValue.increment(1),
      });
    ToastAndroid.show("Book Issued Successfully.", ToastAndroid.SHORT);
    this.setState({ studentID: "", bookID: "" });
  };

  initiateBookReturn = async () => {
    console.log("BookReturn Called.");
    db.collection("transaction").add({
      studentID: this.state.studentID,
      bookID: this.state.bookID,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "Return",
    });

    db.collection("books").doc(this.state.bookID).update({
      bookAvailability: true,
    });

    db.collection("students")
      .doc(this.state.studentID)
      .update({
        booksIssued: firebase.firestore.FieldValue.increment(-1),
      });
    ToastAndroid.show("Book Returned Successfully.", ToastAndroid.SHORT);
    this.setState({ studentID: "", bookID: "" });
  };

  render() {
    var permissionGranted = this.state.hasCameraPermission;
    var isScanned = this.state.isScanned;
    var buttonState = this.state.buttonState;

    if (buttonState === "clicked" && permissionGranted) {
      return (
        <View>
          <Text style={{ marginTop: 50, textAlign: "center" }}>
            SCAN IN PROGRESS...
          </Text>
          <BarCodeScanner
            style={{
              display: "flex",
              alignSelf: "center",
              justifyContent: "center",
              width: "90%",
              height: "90%",
              marginTop: -50,
            }}
            onBarCodeRead={isScanned ? undefined : this.handleBarcodeScan}
            onBarCodeScanned={isScanned ? undefined : this.handleBarcodeScan}
          ></BarCodeScanner>
        </View>
      );
    } else if (buttonState === "normal") {
      return (
        <KeyboardAvoidingView style={{ flex: 1 }} enabled>
          <View style={{ display: "flex", justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 18, textAlign: "center", marginTop: 50 }}>
              Issue or Return a book
            </Text>

            <Image
              source={require("../assets/booklogo.jpg")}
              style={{
                width: 250,
                height: 250,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />

            <View
              style={{
                marginLeft: 10,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <TextInput
                onChangeText={(txt) => {
                  this.setState({ bookID: txt });
                }}
                editable={true}
                placeholder="Book ID"
                value={this.state.bookID}
                style={{
                  backgroundColor: "#C5CED4",
                  width: 225,
                  padding: 10,
                  marginTop: 50,
                }}
              ></TextInput>

              <TouchableOpacity
                onPress={() => {
                  this.getCameraPermission();
                  setTimeout(() => {
                    this.setState({
                      buttonState: "clicked",
                      buttonID: "bookID",
                    });
                  }, 10);
                }}
                style={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: 6,
                  marginTop: 50,
                  width: 100,
                  padding: 10,
                  marginLeft: 5,
                  alignSelf: "center",
                }}
              >
                <Text style={{ textAlign: "center", color: "white" }}>
                  SCAN
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginLeft: 10,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <TextInput
                onChangeText={(txt) => {
                  this.setState({ studentID: txt });
                }}
                editable={true}
                value={this.state.studentID}
                placeholder="Student ID"
                style={{
                  backgroundColor: "#C5CED4",
                  width: 225,
                  padding: 10,
                  marginTop: 20,
                }}
              ></TextInput>

              <TouchableOpacity
                onPress={() => {
                  this.getCameraPermission;
                  setTimeout(() => {
                    this.setState({
                      buttonState: "clicked",
                      buttonID: "studentID",
                    });
                  }, 10);
                }}
                style={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: 6,
                  marginTop: 20,
                  width: 100,
                  padding: 10,
                  marginLeft: 5,
                  alignSelf: "center",
                }}
              >
                <Text style={{ textAlign: "center", color: "white" }}>
                  SCAN
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={this.handleTransaction}
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: 6,
                marginTop: 30,
                width: 110,
                padding: 10,
                marginLeft: 5,
                alignSelf: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                SUBMIT
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    }
  }
}
