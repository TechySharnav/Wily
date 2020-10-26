import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Stylesheet,
  TextInput,
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
    db.collection("books")
      .doc(this.state.bookID)
      .get()
      .then((doc) => {
        var book = doc.data();
        if (book.bookAvailability) {
          this.initiateBookIssue();
          message = "Book Issued";
        } else {
          this.initiateBookReturn();
          message = "Book Returned";
        }
      });
    this.setState({ transactionMsg: message });
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
    Alert.alert("Book Issued Successfully.");
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
    Alert.alert("Book Returned Successfully.");
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
        <View>
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
            style={{ marginLeft: 10, display: "flex", flexDirection: "row" }}
          >
            <TextInput
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
                  this.setState({ buttonState: "clicked", buttonID: "bookID" });
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
              <Text style={{ textAlign: "center", color: "white" }}>SCAN</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{ marginLeft: 10, display: "flex", flexDirection: "row" }}
          >
            <TextInput
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
              <Text style={{ textAlign: "center", color: "white" }}>SCAN</Text>
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
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}
