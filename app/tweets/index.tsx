import { format } from "date-fns";
import { Link, router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Input, Button, FAB, Card, Avatar, Icon } from "react-native-elements";

import { supabase } from "../../lib/supabase";

const TweetsScreen = () => {
  const [tweets, setTweets] = useState([]);
  const [session, setSession] = useState(null);

  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    //get tweets and user info from user table from tweets using user_id
    const getTweets = async () => {
      const { data, error } = await supabase
        .from("tweets")
        .select("*, user:user_id(id, email, username)")
        .order("created_at", { ascending: false });

      if (error) console.log("error", error);
      else {
        setTweets(data);
      }
    };

    getTweets();
  }, []);

  const likeTweet = async (tweet) => {
    //update likes table and recall getTweets
    const { data, error } = await supabase
      .from("likes")
      .insert([{ tweet_id: tweet.id, user_id: session.user.id }]);

    if (error) console.log("error", error);
    else {
      const { data, error } = await supabase
        .from("tweets")
        .select("*, user:user_id(id, email)")
        .order("created_at", { ascending: false });

      if (error) console.log("error", error);
      else {
        setTweets(data);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tweetContainer}>
        {tweets.map((tweet) => (
          <View style={styles.cardContainer} key={tweet.id}>
            <View style={styles.userInfo}>
              <Avatar
                rounded
                icon={{ name: "user", type: "font-awesome" }}
                onPress={() => console.log("Works!")}
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
              <Text style={styles.tweetText}>
                {format(new Date(tweet.created_at), "PPpp")}
              </Text>
            </View>

            {/* Interaction Bar */}
            <View style={styles.interactionBar}>
              <TouchableOpacity style={styles.interactionButton}>
                <Icon
                  name="heart"
                  type="font-awesome"
                  color={tweet.likes_count > 0 ? "red" : "lightgrey"}
                  onPress={() => likeTweet(tweet)}
                  size={18}
                />
                <Text style={styles.interactionCount}>{tweet.likes_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.interactionButton}>
                <Icon
                  name="comment"
                  type="font-awesome"
                  color="#1da1f2"
                  size={18}
                />
                <Text style={styles.interactionCount}>0</Text>
              </TouchableOpacity>
              {/* Add more buttons as needed */}
              <TouchableOpacity style={styles.interactionButton}>
                <Icon
                  name="retweet"
                  type="font-awesome"
                  color="#17bf63"
                  size={18}
                />
                <Text style={styles.interactionCount}>0</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <FAB
        icon={{ name: "add", color: "white" }}
        size="large"
        style={styles.fab}
        onPress={() => router.push("tweetModal")}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15202B",
  },
  tweetContainer: {
    padding: 24,
  },
  fab: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 40,
    right: 20,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 100,
  },
  cardContainer: {
    backgroundColor: "#19232a",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    color: "white",
  },
  userHandle: {
    color: "#8899A6", // Lighter grey color for the handle text
  },
  tweetContent: {
    marginVertical: 5,
    marginLeft: 40,
  },
  tweetText: {
    fontSize: 16,
    color: "#D9D9D9", // Light grey color for the tweet text, for better readability
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
    marginLeft: 5,
    color: "#FFFFFF",
  },
});

export default TweetsScreen;
