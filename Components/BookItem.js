import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Authors from "./Authors";
import Sequences from "./Sequences";
import {Colors} from "../Styles"
const proxyImageUrl ="https://images.weserv.nl/?url=";
const createImageUrl = (cover)=> {
  return proxyImageUrl+ "http://flibusta.is" + cover +"&h=500" ;
};




export default ({book, navigation})=> {
  const {item, index} = book;

  const navigateBook = ()=> {
    navigation.navigate("Book",{book})
  }

  const Cover = ({item})=> {
    // console.log(item.image)
    return <TouchableOpacity onPress={navigateBook} style={{height:157, width: 100, backgroundColor: "lightgrey", marginRight: 10, justifyContent: "center", alignContent: "center"}}>
      {item.image?
        (<Image  style={styles.cover} source={{uri: createImageUrl(item.image) }} />) :
        (<Text style={{textAlign: 'center'}}>{item.title}</Text>)
      }
    </TouchableOpacity>
  };

  const Content = ({children})=> {
    const content = item.content && item.content
        .replace(/<br\/>(.*?)$/g,"")
        .replace(/<p class=\"book"\>/g,"\t")
        .replace(/(<\/p>)|(<br>)|(<b>)|(<\/b>)|(<i>)|(<\/i>)/g,"");

    return <>{item.content && (<Text onPress = {navigateBook} numberOfLines={10}   style={{paddingTop: 5}}>{content}</Text>)}</>
  };


  return (
      <View style={styles.listItem} >
        <View  >
          <Cover   item={item}/>
          <Text style={{textAlign: 'center', fontWeight: "bold"}}>{item?.year}</Text>
        </View>
        <View style={{flexDirection: "column", paddingHorizontal: 0,  flex: 1, width: "100%"}}>
          {/*title*/}
          <Text onPress = {navigateBook} style={{fontWeight: "bold", paddingBottom: 5}}>
            {(index+1)+". "+item.title}</Text>
          <View style={{paddingLeft:15}}>
            <Sequences sequencesId={item.sequencesId} sequencesTitle={item.sequencesTitle}/>
            <Authors authors={item.author}/>
          </View>
          <Content/>
        </View>
      </View>
  )
}


const styles = StyleSheet.create({
  cover: {
    height: 157,
    width: 100,
    marginRight: 10
  },
  listItem: {
    flex:1,
    flexDirection: "row",
    backgroundColor: 'rgba(255,255,255,0)',
    borderWidth: 1,
    borderColor: '#aa3400',
    padding: 10,
  }
});