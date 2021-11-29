import React, { useState, useEffect, useRef } from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "../../Styles";
import {getText, xmlParser} from "../../service";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GenreItem = ({genre, setFilter})=> {
  return (
    <TouchableOpacity onPress={()=> {setFilter(genre)}} >
      <View style={{ backgroundColor: "#fcdcd2",  marginVertical: 4,  marginHorizontal: 8, flexDirection: "row", justifyContent: "space-between"}}>
        <View style={{flexDirection: "row",flex: 5, justifyContent: "flex-start"}}>
          <View style={{width: 10, height: "100%", backgroundColor: Colors.secondary}}/>
          <Text style={{padding: 10, fontSize: 18, color: Colors.prime}}>{genre.title}</Text>
        </View>
        <View style={{flexDirection: "row", flex: 1, justifyContent: "flex-end", paddingRight: 5, alignSelf: "center"}}>
            <Text style={{padding:5, paddingHorizontal: 10, fontSize: 20,  color: Colors.secondary}}>{genre.count}</Text>
        </View>
      </View>
    </TouchableOpacity>)
}

const getGenresFromList = async (queryType)=> {

  //получаем спиок книг из локального хранилища
  const listName = `LIST-${queryType === "popularForWeek"? "W" : "24"}`;
  const result = await AsyncStorage.getItem(listName) ;
  const books = result? JSON.parse(result) : [];

  //группируем книги по жанрам в формате {genreId: count}
  const list = books.reduce((arr, el)=> {
    el.genre.forEach(genre=> arr[genre] = (arr[genre]? arr[genre] : 0)  + 1)
    return arr;
  }, {})

  //формируем список жанров [{id, title, count}]
  let _genres = [];
  for(let key in list) {
    _genres.push({title: key, count: list[key]});
  }

  //возвращаем отсортированный по count список
  return _genres.sort((a,b)=> b.count-a.count)
}

const getGenresFromOPDS = async ()=> {

  //загрузка жанров из opds библиотеки flibusta
  const text = await getText('/opds/newgenres');
  const  _genres = await xmlParser(text);

  //возвращаем отсортированный по count список
  return _genres.map(el=> ({id: el.genreId, title: el.title, count: el.content.split(" ").shift()}))
}


export default ({filter, setFilter, source, queryType})=> {

  const [genres, setGenres] = useState([]);
  const [refresh, setRefresh] = useState(true);

  //загрузка жанров, либо из opds библиотеки flibusta, либо группируем списки популярных книг по жарам
  const getGenres = async ()=> {
    setGenres(source === "opds"? await getGenresFromOPDS():  await getGenresFromList(queryType));
    setRefresh(false);
  }

  //начинаем с загрузки жанров
  useEffect(()=> {
      getGenres();
  },[])

  const onRefresh = () => {
    setRefresh(true);
  };

  return (<View style={{paddingLeft:5}}>
    {filter &&  (<TouchableOpacity onPress={()=> {setFilter(null)}}>
        <View style={{flexDirection: "row", alignItems: "center", paddingVertical: 10, marginLeft: 10}}>
          <Icon color={Colors.prime} size={25} name="close-outline"/>
          <Text style={{paddingLeft:5, fontSize: 18, color: Colors.prime}}>Отменить фильтр</Text>
        </View>
      </TouchableOpacity>)}
    <FlatList
      data={genres}
      onRefresh={onRefresh}
      refreshing={refresh}
      keyExtractor={(item, index) => "key"+index}
      renderItem={({item, index}) => {
          return (<GenreItem genre={item} setFilter={setFilter}/>);
      }}
    />
  </View>)
}