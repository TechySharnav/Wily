import React, { Component } from "react";
import { View, Text, TouchableOpacity, Stylesheet } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

export default class bookTranscationScreen extends Component {
  constructor() {
    super();

    this.state = {
      hasCameraPermission: null,
      isScanned: false,
      ScannedData: "",
      buttonState: "normal",
    };
  }

  getCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      hasCameraPermission: status === "granted",
    });
    console.log(this.state.hasCameraPermission);
  };

  handleBarcodeScan = async (type, data) => {
    this.setState({
      isScanned: true,
      ScannedData: data,
      buttonState: "normal",
    });
  };

  render() {
    var permissionGranted = this.state.hasCameraPermission;
    var isScanned = this.state.isScanned;
    var buttonState = this.state.buttonState;

    if (buttonState === "clicked" && permissionGranted) {
      return (
        <BarCodeScanner
          onBarCodeScanned={isScanned ? undefined : this.handleBarcodeScan}
        ></BarCodeScanner>
      );
    } else {
      return (
        <View>
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            Issue or Return a Book
          </Text>
          <TouchableOpacity
            onLongPress={() => {
              this.getCameraPermission,
                this.setState({ buttonState: "clicked" });
            }}
            onPress={() => {
              this.getCameraPermission,
                this.setState({ buttonState: "clicked" });
            }}
            style={{
              backgroundColor: "lightblue",
              borderRadius: 6,
              marginTop: 50,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 25 }}>
              Scan QR Code
            </Text>
          </TouchableOpacity>
          <Text>
            {permissionGranted
              ? this.state.ScannedData
              : "Permission Not Granted"}
          </Text>
        </View>
      );
    }
  }
}
