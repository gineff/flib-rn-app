//import BookView from "./BookView.js";
import Authors from "./Authors";
import Content from "./Content";
import Cover from "./Cover";
import Genres from "./Genres";
import Sequences from "./Sequences";
import StarsRating from "./StarsRating";
import Comments from "./Comments";

import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, Image, ScrollView, Button, TouchableOpacity, ActivityIndicator} from 'react-native';
//import {StarsRating, Authors, Sequences, Comments, Content} from './index.js';

import {commentParser, getText, fb2Parser} from "../../service";
import {proxyCorsUrl, serverUrl} from "../../Data";
import JSZip from 'jszip';
import Icon from "react-native-vector-icons/Ionicons";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

import { StorageAccessFramework } from 'expo-file-system';

const proxyImageUrl ="https://images.weserv.nl/?url=";
const createImageUrl = (cover)=> {
  return proxyImageUrl+ "http://flibusta.is" + cover +"&h=500" ;
};

const getComments = async (bid)=> {
  const text = await getText('/b/'+bid);
  const data = await commentParser(text);
  console.log("comments", data)
  return  data;
}


export default ({navigation, route})=> {

  console.log("BookView render 3 загрузки: инициализация, title, Комменты ");

  const {item} = route.params;
  const {sequencesTitle, sequencesId, author, content, title, image, downloads, comments, marks, recommendation} = item;
  const [stateComments, setComments] = useState([]);
  const [stateRecommendation, setRecommendation] = useState(0);
  const [stateMarks, setMarks] = useState([10,3.5]);
  const [fetching, setFetching] = useState(false);
  //const fb2 = useRef(downloads?.filter(el=>el.type==="fb2")[0])


  const downloadBook1 = ()=> {
    const fb2 = downloads?.filter(el=>el.type==="application/fb2+zip")[0]
    const url = proxyCorsUrl+"http://flibusta.is"+fb2.href;
    fetch(url).then(res=>res.blob()).then(blob=> {

      console.log("blob", blob)
      let  zip = new JSZip();
      zip.loadAsync(blob)
        .then(z=>{
          console.log("files", z.files)
          for(let key in z.files){
            z.files[key].async("string").then(res=>{
              //console.log(fb2Parser(res))
              const jsdom = fb2Parser(res);
              console.log(jsdom);
            })

            break;
          }
        });
    })

  }

  const downloadBookFromServer = async ()=> {
    const url = `${serverUrl}/file/644094?date=${new Date()}` ;
    const response = await fetch(url);
    const blob = await response.blob();
    //const blob = await response.blob.call(json.blob);
    //const blob = new Blob([json.blob], {type: "application/zip"});


    //   let uint8Array = encoder.encode(json.blob);
    let  zip = new JSZip();
    const z = await zip.loadAsync(blob);

    console.log("files", z.files)


  }


  const downloadBook = async()=> {
    const fb2 = downloads?.filter(el=>el.type==="application/fb2+zip")[0]
    const url = proxyCorsUrl+"http://flibusta.is"+fb2.href;
    try{
      setFetching(true);
      const downloadedFile = await FileSystem.downloadAsync(url,FileSystem.documentDirectory + 'book.fb2.zip')
      // .then((downloadedFile ) => {
      //console.log("downloadedFile", downloadedFile);
      const {uri, headers} = downloadedFile;
      const fileName = headers["Content-Disposition"]?.split("filename=")[1];
      // console.log("filename", fileName);

      //const uri1 = downloadedFile.uri.replace("book.fb2.zip",fileName);
      /*const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if (perm.status != 'granted') {
        return;
      }*/

      setFetching(false);

      /*const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        return;
      }
      const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if (perm.status != 'granted') {
        return;
      }*/
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status != 'granted') {
        return;
      }

      try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } catch (e) {
        console.log('download error', e);
      }

      /*})
      .catch(error => {
        console.error(error);
      });*/

    }catch (e) {
      console.log('download error', e);
      setFetching(false);
    }



  }

  const handleCommentsFetch = async()=> {
    //console.log("get comments")
    //const [_recommendation, _comments, _marks] = await getComments(item.bid);
    //setComments(_comments);
    //setRecommendation(_recommendation);
    //setMarks(_marks);
  }

  useEffect(() => {
    navigation.setOptions({title: item.title});
    setComments(comments || []);
    setRecommendation(recommendation || 0);
    setMarks(marks || [0,0]);
    //handleCommentsFetch();
    //downloadBookFromServer("644094");
  }, []);

  return (
    <ScrollView style={styles.container} >
      {/*Название книги отражаетсе в Хедере. Показываем только, если название не помещается в Хедере */}
      {title.length>30 && (<View style={styles.titleWrapper}><Text style={styles.title}>{title}</Text></View>)}

      {image && (<View style={styles.imageWrapper}>
        <Image  style={styles.image} source={{uri: createImageUrl(image) }} />
      </View>)}
      <StarsRating marks={marks}/>

      <View style={{marginLeft: 15}}>
        <Sequences sequencesTitle={sequencesTitle} sequencesId={sequencesId}/>
        <Authors>{author}</Authors>
      </View>
      <Content style={styles.content}>{content}</Content>

      <View>
        {fetching? (<View><ActivityIndicator /><Text>Загружаем</Text></View>) :
          (<TouchableOpacity>
              <Button onPress={()=>downloadBook()} style={{width:"50%"}} title="Читать"/>
            </TouchableOpacity>
          )}
      </View>
      <View>
        <Text>Книгу рекомендовали: {stateRecommendation}</Text>
        <Text>Оценок: {stateMarks && stateMarks[0]}, средняя  {stateMarks && stateMarks[1]}</Text>
      </View>
      <Comments>{stateComments}</Comments>
    </ScrollView>

  )
}


const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  titleWrapper: {
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",  fontSize:20, textAlign:'justify'
  },
  content: {
    padding: 10, paddingTop:15, fontSize:18
  },
  imageWrapper: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: "center"
  },
  image: {
    resizeMode: "contain",
    flex: 1,
    aspectRatio: 0.67
  },
  ratingWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: 'red'
  }
})

export {Authors, Content, Cover, Genres, Sequences, Comments, StarsRating}
