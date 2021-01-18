import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Button,
  FlatList,
} from "react-native";
import Header from "../components/Header";
import database from "../config/firebase_Config";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Input } from "react-native-elements";
import { FontAwesome } from "expo-vector-icons";

export default class ReadStoryScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      Stories: [],
      searchText: "",
      searchResults: [],
      searchLoading: true,
      searchButtonClicked: false,
    };
  }

  componentDidMount() {
    this.retriveAllData();
  }

  retriveAllData = () => {
    database
      .collection("Stories")
      .get()
      .then((documents) => {
        var arr = [];
        for (var stories in documents.docs) {
          arr.push(documents.docs[stories].data());
        }
        this.setState({
          Stories: arr,
          loading: false,
        });
      });
  };

  returnSearchResults = () => {
    var arr = [];
    database
      .collection("Stories")
      .where("Title", "==", this.state.searchText)
      .get()
      .then((data) => {
        data.docs.forEach((documents) => {
          arr.push(documents.data());
        });
        this.setState({
          searchResults: arr,
          searchLoading: false,
          searchButtonClicked: true,
        });
      });
  };

  render() {
    return (
      <View>
        {this.state.loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="dodgerblue" />
          </View>
        ) : (
          <View>
            <Header
              backgroundColor="tomato"
              centerText="Read Stories"
              textColor="white"
              pressableForRefresh={
                <Icon name="refresh" size={30} color="black" />
              }
              onPressForRefresh={this.retriveAllData()}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ width: "70%" }}>
                <Input
                  placeholder="Type here..."
                  leftIcon={
                    <FontAwesome name="search" size={24} color="black" />
                  }
                  value={this.state.searchText}
                  onChangeText={(text) => this.setState({ searchText: text })}
                  style={{ outline: "none" }}
                />
              </View>

              <Button
                title="Search"
                onPress={() => {
                  this.returnSearchResults();
                }}
              />
            </View>

            {!this.state.Stories.length ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 30, fontWeight: "900", marginTop: 250 }}
                >
                  No Data
                </Text>
              </View>
            ) : this.state.searchLoading || !this.state.searchText ? (
              <FlatList
                data={this.state.Stories}
                renderItem={({ item }) => (
                  <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: 40,
                        borderColor: "purple",
                        borderWidth: 1,
                        margin: 20,
                        padding: 5,
                        backgroundColor: "#FBC02D",
                        borderRadius: 10,
                      }}
                    >
                      <Text style={styles.text}> Title - {item.Title}</Text>
                      <View>
                        <Text style={styles.text}>
                          Author Name - {item.Author}
                        </Text>
                      </View>
                      <View style={{ width: 200 }}>
                        <Text numberOfLines={1} style={styles.text}>
                          Story - {item.Story}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => {
                  item.key;
                }}
              />
            ) : !this.state.searchResults.length &&
              !this.state.searchLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 30, fontWeight: "900", marginTop: 250 }}
                >
                  No Data
                </Text>
              </View>
            ) : (
              <FlatList
                data={this.state.searchResults}
                renderItem={({ item }) => (
                  <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: 40,
                        borderColor: "purple",
                        borderWidth: 1,
                        margin: 20,
                        padding: 5,
                        backgroundColor: "#FBC02D",
                      }}
                    >
                      <Text style={styles.text}> Title - {item.Title}</Text>
                      <View>
                        <Text style={styles.text}>
                          Author Name - {item.Author}
                        </Text>
                      </View>
                      <View style={{ width: 200 }}>
                        <Text numberOfLines={1} style={styles.text}>
                          Story - {item.Story}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => {
                  item.key;
                }}
              />
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
