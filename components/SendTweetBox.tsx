import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Avatar, Icon } from "react-native-elements";

const SendTweetBox = ({ tweet, setTweet, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Avatar
          rounded
          icon={{ name: "user", type: "font-awesome" }}
          activeOpacity={0.7}
        />
        <TextInput
          placeholder="What's happening?"
          placeholderTextColor="#8899A6"
          style={styles.input}
          value={tweet}
          onChangeText={(text) => setTweet(text)}
          numberOfLines={3}
          maxLength={280}
          multiline
        />
        <Icon
          name="send"
          type="font-awesome"
          color="#1DA1F2"
          onPress={onPress}
          size={18}
          style={{ marginRight: 10 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#19232a",
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  input: {
    color: "#FFFFFF",
    marginLeft: 10,
    flex: 1,
    minHeight: 100,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000", // You may need to adjust this based on the actual color
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginLeft: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    marginLeft: 5,
  },
});

export default SendTweetBox;
