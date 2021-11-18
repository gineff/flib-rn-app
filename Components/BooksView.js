import React, {useEffect, useState,useRef} from 'react'
import {FlatList, Text, View, SafeAreaView} from "react-native";
import BookItem from "./BookItem";
import {useBooks} from "../Provider/BooksProvider";
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "../Styles";
import FilterList from "./FilterListView";

const cutStr = (str)=> {
  return (str && str.length>35)? str.slice(0,35)+"..." : str;
}

export default ({navigation, route}) => {

  const uid = Math.floor(Math.random() * 100);
  const {books, getNextPage, filter, setFilter} = useBooks();
  const [refresh, setRefresh] = useState(true);
  const flatListRef = useRef(null);
  const {title, source, queryType} = route.params;
  const runFilterCounter  = useRef(0);
  const [filterIsVisible, setFilterIsVisible] = useState(false);
  const {newBooksFilter} = filter;
  const refFilter = useRef(false);

  console.log("filter", filter);

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
    if(!filterIsVisible && refFilter.current && refFilter.current !== filter){
      console.log("refFilter", refFilter.current);
      setFilter(refFilter.current)
    }
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
    {filterIsVisible?  (<FilterList
        setFilterIsVisible={setFilterIsVisible}
        refFilter={refFilter}
        navigation={navigation}
        route={route} />) :
    (<FlatList
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
    />)}
  </View></SafeAreaView>
}