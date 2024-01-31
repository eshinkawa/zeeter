import { format } from "date-fns";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "react-native-elements";

const TweetCard = ({ likeTweet, unlikeTweet, tweet, didUserLikeTweet }) => {
  return (
    <View style={styles.cardContainer} key={tweet.id}>
      <View style={styles.userInfo}>
        <Avatar
          rounded
          icon={{ name: "user", type: "font-awesome" }}
          activeOpacity={0.7}
          containerStyle={{ backgroundColor: "grey", marginRight: 8 }}
        />
        <View>
          <Text style={styles.userName}>Edu Shin</Text>
          <Text style={styles.userHandle}>@{tweet.user.username}</Text>
        </View>
      </View>

      <View style={styles.tweetContent}>
        <Text style={styles.tweetText}>{tweet.content}</Text>
        <Text style={styles.tweetTime}>
          {format(new Date(tweet.created_at), "PPpp")}
        </Text>
      </View>

      <View style={styles.interactionBar}>
        <TouchableOpacity style={styles.interactionButton}>
          <Icon
            name={tweet.likes_count > 0 ? "heart" : "heart-o"}
            type="font-awesome"
            color={tweet.likes_count > 0 ? "red" : "lightgrey"}
            onPress={
              didUserLikeTweet && tweet.likes_count > 0
                ? unlikeTweet
                : likeTweet
            }
            size={18}
          />
          <Text style={styles.interactionCount}>{tweet.likes_count}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interactionButton}>
          <Icon name="comment" type="font-awesome" color="#1da1f2" size={18} />
          <Text style={styles.interactionCount}>0</Text>
        </TouchableOpacity>
        {/* Add more buttons as needed */}
        <TouchableOpacity style={styles.interactionButton}>
          <Icon name="retweet" type="font-awesome" color="#17bf63" size={18} />
          <Text style={styles.interactionCount}>0</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#19232a",
    padding: 10,
    margin: 10,
    borderRadius: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  userHandle: {
    color: "#8899A6",
  },
  tweetContent: {
    marginTop: 10,
    marginLeft: 40,
  },
  tweetText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  tweetTime: {
    fontSize: 12,
    color: "#8899A6",
    marginBottom: 6,
  },
  interactionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  interactionCount: {
    color: "#8899A6",
    marginLeft: 5,
  },
});

export default TweetCard;
