import {StyleSheet, Text} from "react-native";
import React from "react";

const Content = ({children})=> {
  const content = children;

  if(!content) return <></>;

  const _content = content
    .replace(/<br\/>(.*?)$/g,"")
    .replace(/<p class=\"book"\>/g,"\t")
    .replace(/\n/g,"")
    .replace(/(<\/p>)|(<br>)|(<b>)|(<\/b>)|(<i>)|(<\/i>)/g,"");

  return <Text style={styles.bookContent}  numberOfLines={10}  >{_content}</Text>
};

const styles = StyleSheet.create({
  bookContent: {
    marginTop: 5
  }
})

export default Content;