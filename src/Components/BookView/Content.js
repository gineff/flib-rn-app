import {StyleSheet, Text} from "react-native";
import React from "react";

const Content = ({children, style, numberOfLines})=> {
  const content = children;

  if(!content) return <></>;

  const _content = content
    .replace(/<br\/>(.*?)$/g,"")
    .replace(/<p class=\"book"\>/g,"\t")
    .replace(/\n/g,"")
    .replace(/(<\/p>)|(<br>)|(<b>)|(<\/b>)|(<i>)|(<\/i>)/g,"");

  return <Text style={style? {...style, ...styles.bookContent} : styles.bookContent}  numberOfLines={numberOfLines}  >{_content}</Text>
};

const styles = StyleSheet.create({
  bookContent: {
    marginTop: 5,
    textAlign:'justify'
  }
})

export default React.memo(Content);