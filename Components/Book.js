import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

const proxyImageUrl ="https://images.weserv.nl/?url=";
const createImageUrl = (cover)=> {
  return proxyImageUrl+ "http://flibusta.is" + cover +"&h=500" ;
};
const Cover = ({item})=> {
 // console.log(item.image)
  return <View style={{width: "100%"}}>
    <Image  style={{width: "100%"}} source={{uri: createImageUrl(item.image) }} />

  </View>
};


const Author = ({author, navigation, style})=> {
  return (<View>
      {author.map((el,i)=>
          (<Text {...{style}} onPress = {()=> {navigation.push("Author",{query:el.id});}} key={i}>{el.name} </Text>))}
  </View>)
};

export default ({navigation, route})=> {

  const {book} = route.params;
  const item = book.item;

  return (
      <View style={{flex: 1, backgroundColor: '#fff',  alignItems: 'center', justifyContent: 'center'}} >
        <Image  style={{width: 320, height: 500}} source={{uri: createImageUrl(item.image) }} />
        <Text style={{fontWeight: "bold", paddingBottom: 5}}>{item.title}</Text>
          {/*sequence*/}
        {!!item.sequencesTitle.length && (<Text style={{color:'#f4511e', marginBottom: 5}}>Серия: {item.sequencesTitle.join("; ")}</Text>)}
          {/*author*/}
        <Author style={{color:'#f4511e'}} author = {item.author} navigation = {navigation}/>
        {item.content && (<Text style={{paddingTop: 5}}>
          {item.content.replace(/(<p class=\"book"\>)|(<\/p>)|(<br>)|(<i>)|(<\/i>)/g,"").replace(/<br\/>/,"\n").replace(/<br\/>/g," ")}
        </Text>)}

        </View>

  )
}


