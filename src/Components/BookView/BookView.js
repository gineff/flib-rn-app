import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import Authors from "./Authors";
import Sequences from "./Sequences";
import Comments from "./Comments";
import Content from "./Content";
import {Colors} from "../../Styles"
import {commentParser, getText} from "../../service";
const proxyImageUrl ="https://images.weserv.nl/?url=";
const createImageUrl = (cover)=> {
  return proxyImageUrl+ "http://flibusta.is" + cover +"&h=500" ;
};

export default ({navigation, route})=> {

  console.log("BookView render 3 загрузки: инициализация, title, Комменты ");

  const {item} = route.params;
  const {sequencesTitle, sequencesId, author, content, title, image} = item;
  const [comments, setComments] = useState([]);
  const [recomendation, setRecomendation] = useState("");

  const getComments = async ()=> {
    const text = await getText('/b/'+item.bid);
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
        <Image  style={{width: 320, height: 500}} source={{uri: createImageUrl(image) }} />
        <Text style={{fontWeight: "bold", paddingVertical: 10, fontSize:20}}>{title}</Text>
      </View>
      <View style={{marginLeft: 15}}>
        <Sequences sequencesTitle={sequencesTitle} sequencesId={sequencesId}/>
        <Authors>{author}</Authors>
      </View>
      <Content style={{padding: 25, paddingTop:15, fontSize:18,  alignContent: 'space-between'}}>{content}</Content>
      <Comments>{comments}</Comments>
    </ScrollView>

  )
}


