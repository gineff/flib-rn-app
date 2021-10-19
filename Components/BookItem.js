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
      (<Text style={{textAlign: 'center'}}>{item.title}</Text>)
    }
  </View>
};


const Author = ({author, navigation, style})=> {
  return (<View>
      {author.map((el,i)=>
          (<Text {...{style}} onPress = {()=> {navigation.push("Author",{query:el.id});}} key={i}>{el.name} </Text>))}
  </View>)
};

export default ({book, navigation})=> {
  const {item, index} = book;

  return (
      <View style={styles.listItem} >
        <View  >
          <Cover  item={item}/>
          <Text style={{textAlign: 'center', fontWeight: "bold"}}>{item?.year}</Text>
        </View>
        <View style={{flexDirection: "column", paddingHorizontal: 0,  flex: 1, width: "100%", maxHeight: 170}}>
          {/*title*/}
          <Text onPress = {()=> {navigation.navigate("Book",{book})}} style={{fontWeight: "bold", paddingBottom: 5}}>{index+". "+item.title}</Text>
          {/*sequence*/}
          {!!item.sequencesTitle.length && (<Text style={{color:'#f4511e', marginBottom: 5}}>Серия: {item.sequencesTitle.join("; ")}</Text>)}
          {/*author*/}
          <Author style={{color:'#f4511e'}} author = {item.author} navigation = {navigation}/>
          {item.content && (<Text style={{paddingTop: 5}}>
            {item.content.replace(/(<p class=\"book"\>)|(<\/p>)|(<br>)|(<i>)|(<\/i>)/g,"").replace(/<br\/>/,"\n").replace(/<br\/>/g," ")}
          </Text>)}

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