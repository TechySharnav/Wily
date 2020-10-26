import React, { Component } from "react";
import SearchScreen from "./screen/SearchScreen";
import bookTransactionScreen from "./screen/bookTransactionScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Image } from "react-native";

const Tab = createBottomTabNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({}) => {
              let imgName;

              if (route.name === "bookTransaction") {
                imgName = require("./assets/book.png");
              } else if (route.name === "SearchScreen") {
                imgName = require("./assets/searchingbook.png");
              }

              // You can return any component that you like here!
              return (
                <Image style={{ width: 20, height: 20 }} source={imgName} />
              );
            },
          })}
          tabBarOptions={{
            activeTintColor: "#ef4b4c",
            inactiveTintColor: "#a9a9ab",
          }}
        >
          <Tab.Screen
            name="bookTransaction"
            component={bookTransactionScreen}
          />
          <Tab.Screen name="SearchScreen" component={SearchScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
