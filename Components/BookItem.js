import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

const proxyImageUrl ="https://images.weserv.nl/?url=";
const createImageUrl = (cover)=> {
  return proxyImageUrl+ "http://flibusta.is" + cover +"&h=500" ;
};
const Cover = ({item})=> {
 // console.log(item.image)
  return <View style={{height:157, width: 100, backgroundColor: "lightgrey", marginRight: 10, justifyContent: "center", alignContent: "center"}}>
    {item.image?
      (<Image  style={styles.cover} source={{uri: createImageUrl(item.image) }} />) :
      (<Text>{item.title}</Text>)
    }
  </View>
};


const Author = ({author, navigation})=> {
  return (<View>
      {author.map((el,i)=>
          (<Text onPress = {()=> {navigation.navigate("Author",{query:el.id});}} key={i}>{el.name} </Text>))}
  </View>)
};

export default ({book, navigation})=> {
  const {item, index} = book;

  return (
    <View style={styles.listItem} >
      <Cover item={item}/>
      <View style={{flexDirection: "column", paddingHorizontal: 0,  flex: 1, width: "100%"}}>
        <Text>{index}</Text>
        {/*title*/}
        <Text style={{fontWeight: "bold"}}>{item.title}</Text>
        {/*sequence*/}
        {!!item.sequencesTitle.length && (<Text>Серия: {item.sequencesTitle.join("; ")}</Text>)}
        {/*author*/}
        <Author author = {item.author} navigation = {navigation}/>
        {item.content && (<Text style={{fontWeight: "bold"}}>{item.content.replace(/(<p class=\"book\") | (<\/p>) | <\/br>/g,"")}</Text>)}

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