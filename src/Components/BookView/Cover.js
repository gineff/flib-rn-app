import {StyleSheet, Image, Text, View} from "react-native";
import React, {useRef} from "react";
import {proxyImageUrl} from "../../Data"

const createImageUrl = (cover)=> {
  return proxyImageUrl+ "http://flibusta.is" + cover +"&h=500" ;
};

const Cover = ({image, title, style})=> {
  return <View  style={[styles.bookCoverWrapper, style]}>
    {image?
      (<Image  style={styles.bookCover} source={{uri: createImageUrl(image) }} />) :
      (<Text style={styles.bookCoverText}>{title}</Text>)
    }
  </View>
};

const styles = StyleSheet.create({
  bookCoverWrapper: {
    padding: 5,
    width: "100%",
    minHeight: 167
  },
  bookCover: {
    aspectRatio: 100/157,
    width: "100%",
  },
  bookCoverText: {
    textAlign: 'center'
  }
})


export default React.memo(Cover);