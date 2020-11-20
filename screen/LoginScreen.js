import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import firebase from "firebase";

export default class LoginScreen extends Component {
  constructor() {
    super();
    this.state = { emailID: "", password: "" };
  }

  submitDetails = async () => {
    console.log(this.state);
    var email = this.state.emailID;
    var pwd = this.state.password;

    if (email && pwd) {
      try {
        var response = await firebase
          .auth()
          .signInWithEmailAndPassword(email, pwd);
        if (response) {
          this.props.navigation.navigate("Transaction");
        }
      } catch (err) {
        switch (err.code) {
          case "auth/user-not-found":
            Alert.alert("User Doesn't Exist");
            break;
          case "auth/invalid-email":
            Alert.alert("Incorrect Email or Password");
            break;
        }
      }
    } else {
      Alert.alert("Enter Email and Password");
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} enabled>
          <View style={{ display: "flex", justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 18, textAlign: "center", marginTop: 50 }}>
              Login
            </Text>

            <Image
              source={require("../assets/login.png")}
              style={{
                width: 200,
                height: 200,
                resizeMode: "contain",
                alignSelf: "center",
                marginTop: 40,
              }}
            />
            <TextInput
              style={{
                backgroundColor: "#C5CED4",
                width: "90%",
                padding: 10,
                marginTop: 50,
                alignSelf: "center",
              }}
              keyboardType="email-address"
              placeholder="Enter Email"
              onChangeText={(txt) => this.setState({ emailID: txt })}
              value={this.state.emailID}
            ></TextInput>

            <TextInput
              style={{
                backgroundColor: "#C5CED4",
                width: "90%",
                padding: 10,
                marginTop: 20,
                alignSelf: "center",
              }}
              secureTextEntry={true}
              placeholder="Enter Password"
              onChangeText={(txt) => this.setState({ password: txt })}
              value={this.state.password}
            ></TextInput>

            <TouchableOpacity
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: 6,
                marginTop: 50,
                width: 120,
                padding: 10,
                marginLeft: 5,
                alignSelf: "center",
              }}
              onPress={this.submitDetails}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                SUBMIT
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}
