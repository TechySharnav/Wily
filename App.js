import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

import SearchScreen from "./screen/SearchScreen";
import bookTransactionScreen from "./screen/bookTransactionScreen";
import LoginScreen from "./screen/LoginScreen";

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const TabNavigator = createBottomTabNavigator(
  {
    Transaction: { screen: bookTransactionScreen },
    Search: { screen: SearchScreen },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: () => {
        const routeName = navigation.state.routeName;
        console.log(routeName);
        if (routeName === "Transaction") {
          return (
            <Image
              source={require("./assets/book.png")}
              style={{ width: 20, height: 20 }}
            />
          );
        } else if (routeName === "Search") {
          return (
            <Image
              source={require("./assets/searchingbook.png")}
              style={{ width: 20, height: 20 }}
            />
          );
        }
      },
    }),
    tabBarOptions: {
      activeTintColor: "#ef4b4c",
      inactiveTintColor: "#a9a9ab",
    },
  }
);

const switchNavigator = createSwitchNavigator({
  LoginScreen: { screen: LoginScreen },
  TabNavigator: { screen: TabNavigator },
});

const AppContainer = createAppContainer(switchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
});
