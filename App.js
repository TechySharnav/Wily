import React, { Component } from "react";
import SearchScreen from "./screen/SearchScreen";
import bookTranscationScreen from "./screen/bookTranscationScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="bookTransaction"
            component={bookTranscationScreen}
          />
          <Tab.Screen name="SearchScreen" component={SearchScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
