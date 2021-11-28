import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import Authors from "./Authors";
import Sequences from "./Sequences";
import Comments from "./Comments";
import {Colors} from "../../Styles"
import {commentParser, getText} from "../../service";
const proxyImageUrl ="https://images.weserv.nl/?url=";
const createImageUrl = (cover)=> {
  return proxyImageUrl+ "http://flibusta.is" + cover +"&h=500" ;
};


const Content = ({children, style})=> {
   const content = children
    .replace(/<br\/>/g,"\n")
    .replace(/<\/p>/g,"\n")
    .replace(/<p class=\"book"\>/g,"\t")
    .replace(/(<br>)|(<b>)|(<\/b>)|(<i>)|(<\/i>)/g,"");

  return <>{content && (<Text style={{...style}}>{content}</Text>)}</>
};

export default ({navigation, route})=> {
  const {book} = route.params;
  const item = book.item;
  const [comments, setComments] = useState([]);
  const [recomendation, setRecomendation] = useState("");

  const getComments = async ()=> {
    const text = await getText('/b/'+book.item.bid);
    const data = await commentParser(text);
    return  data;
  }

  const handleCommentsFetch = async()=> {
    const [_recomendation, _comments] = await getComments();
    setComments(_comments);
    setRecomendation(_recomendation);
  }

  useEffect(() => {
    navigation.setOptions({title: item.title});
    handleCommentsFetch()
  }, []);

  return (
    <ScrollView style={{flex: 1}} >
      <View style={{ alignItems: 'center',  paddingHorizontal: 15, paddingTop: 10}}>
        <Image  style={{width: 320, height: 500}} source={{uri: createImageUrl(item.image) }} />
        <Text style={{fontWeight: "bold", paddingVertical: 10, fontSize:20}}>{item.title}</Text>
      </View>
      <View style={{marginLeft: 15}}>
        <Sequences style={{fontSize:20}} item={item}/>
        <Authors style={{fontSize:20}}>{item.author}</Authors>
      </View>
      <Content style={{padding: 25, paddingTop:15, fontSize:18,  alignContent: 'space-between'}}>{item.content}</Content>
      <Comments>{comments}</Comments>
    </ScrollView>

  )
}


