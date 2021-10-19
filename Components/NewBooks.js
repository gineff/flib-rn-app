import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, Image, Button, TouchableOpacity, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import xmlParserFlibusta from "../service/xmlParserFlibusta";
import BookItem from "./BookItem";
import matchAll from "string.prototype.matchall";
const proxyCorsUrl ="https://api.allorigins.win/raw?url=";
const searchUrl = '/opds/opensearch?searchType=books&searchTerm=';

const generateUrl = ({page, params}) => {
  const {queryType, query} = params;
  let url;
  if(queryType === "author"){
    url = "/opds/author/" + query + "/time"+"/"+(page-1);
  }else if(queryType === "sequence"){
    url =  "/opds/sequencebooks/"+query+"/"+(page-1);
  }else if(queryType === "genre") {
    //const genre = genres.filter(genre=>genre.title === query.id)[0];
    url =  "/opds/new/" + page  + "/newgenres/" + query;
  }else if(queryType === "search") {
    url = '/opds/opensearch?searchType=books&searchTerm=' + query;
  }else if(queryType === "popularDay"){
    url =  "/stat/24";
  }else if(queryType === "week"){
    url =  "/opds/new/" + (page - 1) + "/new/" ;
  }
  return url;
};

export default ({navigation, route})=> {

  const flatListRef = useRef(null);
  const [limit] = useState(20);
  const [page, setPage] = useState(1);
  const [clientData, setClientData] = useState([]);
  const [pending_process, setPending_process] = useState(true);
  const [loadmore, setLoadmore] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const {parseType} = route.params;
  const [appName,sap] = useState(("name-")+route.name);

  const requestToServer = async page => {
    const url = generateUrl({...route, page});
    console.log("request to server", url);
    const text = await getText(url);
    //парсится либо opds xml либо html
    const data = parseType === "xml"? await xmlParserFlibusta(text) : await htmlParser(text);
    //страница html  загружается один раз
    if(parseType === "html") setLoadmore(false)
    handleServerData(data);
  };

  const getText = async (url)=> {
    return fetch(proxyCorsUrl+encodeURIComponent('http://flibusta.is'+url))
        .then(response=>response.text())
  };

  const htmlParser = async (text)=> {
    const matches = Array.from(matchAll(text,/<a href="\/a\/(.*?)">(.*?)<\/a> - <a href="\/b\/(.*?)">(.*?)<\/a>/g));
    return  matches.map(el=>({
      bid:el[3],
      author:[{name:el[2], id: el[1]}],
      title:el[4],
      sequencesTitle: []
    }))
  };

  const searchBook = async (book)=> {
    console.log("search in opds", book.title);
    const str = book.title.replace(/\[.*?\]/g,"");
    const text = await getText(searchUrl+encodeURIComponent(str));
    const data = xmlParserFlibusta(text);
    return data.filter(el => el.bid === book.bid)[0];
  };

  const unfold = async (data)=> {

    let unfoldedData = {};

    for(let book of data) {
      let value = await AsyncStorage.getItem('BOOK-'+book.bid);
      if (value === null) {
        value = await searchBook(book);
        if(value) AsyncStorage.setItem('BOOK-'+book.bid, JSON.stringify(value));
      }
      unfoldedData[book.bid] = JSON.parse(value);
    }
    return  unfoldedData;

  };

  const unfoldData =  async (data) => {
    //разбиваем данные на 5 частей
    //unfold(data.slice(0,3)).then((res)=> console.log(res))
    const result = [];
    for(let i = 0; i < 5; i++) {
      //await unfold(data.slice(i*limit,(i+1)*limit))
      const res = await unfold(data.slice(i*limit,(i*limit)+3));
      console.log(clientData.length);
      clientData.map((el=> {console.log(res[el.bid])}))  ;
      //const newClientData = clientData.map((el=> res[el.bid] || el))  ;
      //console.log(newClientData)
      //setClientData(newClientData);
    }
    console.log(result);
  };

  useEffect(()=>{
    console.log("---------screen start", route.name);
  },[]);

  const handleServerData = (data)=> {

      console.log("server data updated", appName);
      if (data.length > 0 ) {
        setRefresh(false);
        setClientData([...clientData, ...data]);
        if(parseType === "html") (()=> unfoldData(data))();
        setLoadmore(data.length === limit);
        setPending_process(false);
      } else {
        setLoadmore(false)
      }
  };

  useEffect(()=>{

    console.log('page changed', page);
    // при обновлении сервера экспо состояния (clientData, page) сохраняются,
    // при этом происходит срабатывание события useEffect по этим состояниям.
    // из-за чего дублируется clientData
    //clientData.length/limit < page === page защита от дублирования
    
    console.log(loadmore, clientData.length, clientData.length/limit );
    if(loadmore && (clientData.length === 0 || (clientData.length/limit < page))) {
      setPending_process(true);
      setRefresh(true);
      requestToServer(page);
    }
  }, [page]);

  const handleLoadMore = () => {
    if (loadmore && !pending_process) {
      setPage(page + 1);
    }
  };

  const onRefresh = () => {
    setClientData([]);
    setPage(1);
    setRefresh(true);
    setPending_process(false);
  };

  return <View>
    <Text>Новые книги</Text>
    <FlatList
      ref={flatListRef}
      refreshing={refresh}
      data={clientData}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      onRefresh={() => onRefresh()}
      keyExtractor={(item, index) => "key"+index}
      renderItem={(book) => {
        return (<BookItem book={book} navigation={navigation}/>);
    }}
    />
  </View>
}

const styles = StyleSheet.create({
  cover: {
    height: 150,
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