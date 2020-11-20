import React, { Component } from "react";
import { Text, ScrollView, View, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";
import db from "../config";

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allTransactions: [],
      funcCalled: false,
      lastVisibleTransaction: null,
      searchTxt: "",
    };
  }

  componentDidMount = async () => {
    await this.getAllTransactions(null);

    setTimeout(() => this.setState({ funcCalled: true }), 2000);
  };

  getAllTransactions = async (txt) => {
    txt = txt === null ? null : txt.trim();
    if (txt === null) {
      var transactionRef = await db.collection("transaction").limit(10).get();
    } else if (txt[0].toUpperCase() + txt[1].toUpperCase() === "ST") {
      this.setState({ allTransactions: [] });
      var transactionRef = await db
        .collection("transaction")
        .where("studentID", "<=", txt)
        .limit(10)
        .get();
    } else if (txt[0].toUpperCase() + txt[1].toUpperCase() !== "ST") {
      this.setState({ allTransactions: [] });
      var transactionRef = await db
        .collection("transaction")
        .where("bookID", "==", txt.trim())
        .limit(10)
        .get();
    }

    transactionRef.docs.map(async (doc) => {
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()],
        lastVisibleTransaction: doc,
      });

      /* this.setState({allTransactions: [...this.state.allTransactions, doc.data()]})
       */
    });

    console.log(this.state.allTransactions, "Transaction Array");
  };

  fetchMoreTransactions = async () => {
    var query = await db
      .collection("transaction")
      .startAfter(this.state.lastVisibleTransaction)
      .limit(10)
      .get();
    query.docs.map(async (doc) => {
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()],
        lastVisibleTransaction: doc,
      });
    });
  };

  render() {
    return (
      <View>
        <Text style={{ fontSize: 18, textAlign: "center", marginTop: 50 }}>
          Search the Transactions
        </Text>
        <SearchBar
          containerStyle={{
            backgroundColor: "transparent",
            borderWidth: 0,
          }}
          round={false}
          placeholder="Enter Student/Book ID"
          onChangeText={async (txt) => (
            this.setState({ searchTxt: txt.trim(), allTransactions: [] }),
            await this.getAllTransactions(txt.trim())
          )}
          value={this.state.searchTxt}
          lightTheme={true}
          inputContainerStyle={{
            borderColor: "#3d619B",
            borderWidth: 2,
            borderBottomColor: "#3d619b",
            marginTop: -1,
          }}
          inputStyle={{ padding: -10 }}
        />
        <FlatList
          contentContainerStyle={{ paddingBottom: 40 }}
          data={this.state.allTransactions}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#e8e8e8",
                marginTop: 10,
                marginLeft: 10,
                padding: 10,
                fontSize: 18,
                width: "95%",
                borderColor: "#8e8e8e",
                borderWidth: 2,
              }}
            >
              <Text>BookID : {item.bookID}</Text>
              <Text>StudentID: {item.studentID}</Text>
              <Text>Transaction Type: {item.transactionType}</Text>
            </View>
          )}
          keyExtractor={(item, index) => {
            index.toString();
          }}
          onEndReached={this.fetchMoreTransactions}
          onEndReachedThreshold={0.7}
        />
      </View>
    );
  }
}
