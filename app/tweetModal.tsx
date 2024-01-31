//create modal

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, StyleSheet, View, AppState, SafeAreaView } from "react-native";
import { Button, Input } from "react-native-elements";

import { supabase } from "../lib/supabase";

const TweetModal = () => {
  const [tweet, setTweet] = useState("");
  const [session, setSession] = useState(null);
  const router = useRouter();

  const handleTweet = async () => {
    const { data, error } = await supabase
      .from("tweets")
      .insert([{ content: tweet, user_id: session.user.id }])
      .select("*, user:user_id(id, email)");

    if (error) console.log("error", error);
    else {
      router.pop();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tweetContainer}>
        <Text>TweetModal</Text>
        <Input
          placeholder="What's happening?"
          onChangeText={(text) => setTweet(text)}
        />
        <Button title="Tweet" onPress={handleTweet} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tweetContainer: {
    width: "80%",
  },
});

export default TweetModal;
