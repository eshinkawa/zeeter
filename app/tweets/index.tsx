import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";

import SendTweetBox from "../../components/SendTweetBox";
import TweetCard from "../../components/TweetCard";
import { supabase } from "../../lib/supabase";

const TweetsScreen = () => {
  const [tweets, setTweets] = useState([]);
  const [session, setSession] = useState(null);
  const [tweet, setTweet] = useState("");

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
        .select("*, user:user_id(id, email, username)")
        .order("created_at", { ascending: false });

      if (error) console.log("error", error);
      else {
        setTweets(data);
      }
    }
  };

  const unlikeTweet = async (tweet) => {
    //delete from likes table and recall getTweets
    const { data, error } = await supabase
      .from("likes")
      .delete()
      .eq("tweet_id", tweet.id)
      .eq("user_id", session.user.id);

    if (error) console.log("error", error);
    else {
      const { data, error } = await supabase
        .from("tweets")
        .select("*, user:user_id(id, email, username)")
        .order("created_at", { ascending: false });

      if (error) console.log("error", error);
      else {
        setTweets(data);
      }
    }
  };

  const didUserLikeTweet = useCallback(
    async (tweet) => {
      const { data, error } = await supabase
        .from("likes")
        .select("*")
        .eq("tweet_id", tweet.id)
        .eq("user_id", session.user.id);

      if (error) console.log("error", error);
      else {
        console.log("data", data);
        return data.length > 0;
      }
    },
    [session],
  );

  const sendTweet = async () => {
    const { error } = await supabase
      .from("tweets")
      .insert([{ content: tweet, user_id: session.user.id }])
      .select("*, user:user_id(id, email)");

    if (error) console.log("error", error);
    else {
      setTweet("");
      const { data, error } = await supabase
        .from("tweets")
        .select("*, user:user_id(id, email, username)")
        .order("created_at", { ascending: false });

      if (error) console.log("error", error);
      else {
        setTweets(data);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SendTweetBox tweet={tweet} setTweet={setTweet} onPress={sendTweet} />
      {tweets.map((tweet) => (
        <TweetCard
          key={tweet.id}
          likeTweet={() => likeTweet(tweet)}
          unlikeTweet={() => unlikeTweet(tweet)}
          tweet={tweet}
          didUserLikeTweet={didUserLikeTweet(tweet)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#15202b",
  },
  fab: {
    backgroundColor: "#1da1f2",
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TweetsScreen;
