import React, {useEffect, useState,useRef} from 'react'
import {FlatList, Text, View, SafeAreaView} from "react-native";
import BookItem from "./BookItem";
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "../Styles";

const cutStr = (str)=> {
  return (str && str.length>35)? str.slice(0,35)+"..." : str;
}

const GenreItem = ({genre,  navigation})=> {
  return <View style={{flexDirection: "row"}}>
    <Text style={{color: Colors.prime, textDecorationLine: 'underline'}}>{genre.title}</Text>
    <Text> - </Text>
    <Text style={{color: Colors.secondary}}>{genre.count}</Text>
  </View>
}

const Filter = ({refGenres, navigation})=> {

  /*const [genres, setGenres] = useState([]);

  useEffect(()=> {
    const newGenres = getNewGenres();
    setGenres(newGenres);
  }, [])

*/
  console.log(refGenres.current);

  return (<View>
    <FlatList
      data={refGenres.current}
      onEndReachedThreshold={0.1}
      keyExtractor={(item, index) => "key"+index}
      renderItem={({item, index}) => {
        return (<GenreItem genre={item} navigation={navigation}/>);
      }}
    />
  </View>)
}

const old =  ({navigation, route}) => {

  const uid = Math.floor(Math.random() * 100);
  const {books, getNextPage, filter, setFilter, refGenres} = useBooks();
  const [refresh, setRefresh] = useState(true);
  const flatListRef = useRef(null);
  const {title, source, queryType} = route.params;
  const runFilterCounter  = useRef(0);
  const [filterIsVisible, setFilterIsVisible] = useState(false);
  const {newBooksFilter} = filter;
  const refFilter = useRef(false);

  //console.log("filter", filter);

  /*TODO * пренести сюда обработку фильтра"
         * добавить фильтр исключение
   */

  //один раз меняется books, другой refreshing
  console.log(uid, "booksView render", runFilterCounter.current )
  runFilterCounter.current = runFilterCounter.current + 1;

  const filterTitle = (filterIsVisible? "Фильтр по жанрам" : (<View >
    <Text style={{color: "#FFF", fontSize: 18}}>{title}</Text>
    <Text style={{color: "#FFF",  fontSize: 10}}>{cutStr(newBooksFilter?.title)}</Text></View>))

  const filterIcon = <Icon.Button
    onPress={() => {
      console.log("visible filter", filterIsVisible);
      setFilterIsVisible(!filterIsVisible)
    }}
    name="filter"
    color="#FFF"
    backgroundColor={Colors.prime}
  />

  /*TODO упростить*/
  const setTitle = ()=> {
    const header = {};
    if (queryType === "newForWeek") {
      //header.headerRight = () => filterIcon
      header.title = filterTitle
    }else if((queryType === "popularForWeek") || queryType === "popularForDay"){
      //header.headerRight = () => filterIcon
    }else if(queryType === "author"  && books.length){
      const author = books[0].author[0].name;
      header.title = author;
    }else if( queryType === "sequence" && books.length){
      const sequence = books[0].sequencesTitle[0];
      header.title = sequence;

    }
    navigation.setOptions(header);
  }

  const setHeaderRight = ()=> {
    navigation.setOptions({headerRight : () => filterIcon});
  }

  useEffect(()=> {
    /*TODO refFilter.current !== filter не работает и происходит перерисовка, загруженные книги теряются*/
/*
    if(!filterIsVisible && refFilter.current && refFilter.current !== filter){
      //console.log("refFilter", refFilter.current);
      setFilter(refFilter.current)
    }*/
    setHeaderRight()
  }, [filterIsVisible])

  useEffect(()=>{
    setTitle();

    /*TODO refresh false on book loading*/
    if(books.length && refresh) {
      setRefresh(false);

    }

    /*if(initRef.current){
      initRef.current = false;
    }else{

    }*/
  },[books])

  const handleLoadMore = () => {
    if (!refresh && books.length && books.length% 20 === 0) {
      getNextPage();
      setRefresh(true);
    }
  };

  const onRefresh = () => {
    setRefresh(true);
  };

  return    <SafeAreaView><View>
    {filterIsVisible &&   <Filter refGenres={refGenres} navigation={navigation}/>}
    <FlatList
      ref={flatListRef}
      onRefresh={onRefresh}
      refreshing={refresh}
      data={books}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      keyExtractor={(item, index) => "key"+index}
      renderItem={({item, index}) => {
        return (<BookItem book={{item, index}} navigation={navigation}/>);
      }}
    />
  </View></SafeAreaView>
}

export default ({navigation, route})=> {
  console.log("render BooksView");
  console.log(navigation, route);
  return <View></View>
}