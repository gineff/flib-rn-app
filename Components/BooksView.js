import React, {useEffect, useState,useRef} from 'react'
import {FlatList, Text, View, SafeAreaView} from "react-native";
import BookItem from "./BookItem";
import {useBooks} from "../Provider/BooksProvider";
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "../Styles";
import FilterPanel from "./FilterPanelView";
import FilterList from "./FilterListView";

const cutStr = (str)=> {
  return (str && str.length>35)? str.slice(0,35)+"..." : str;
}

export default ({navigation, route}) => {


  console.log('\x1b[36m%s\x1b[0m', "navigation", navigation);
  console.log('\x1b[36m%s\x1b[0m', "route", route);

  const uid = Math.floor(Math.random() * 100);
  const {books, getNextPage, filter} = useBooks();
  const [refresh, setRefresh] = useState(true);
  const flatListRef = useRef(null);
  const initRef = useRef(true);
  const {title, source, queryType} = route.params;
  const runFilterCounter  = useRef(0);

  const [filterVisibility, setFilterVisibility] = useState({panel: false, list: false});
  const [filterIsVisible, setFilterIsVisible] = useState(false);
  const {newBooksFilter} = filter;

  //один раз меняется books, другой refreshing
  console.log(uid, "booksView render", runFilterCounter.current )
  runFilterCounter.current = runFilterCounter.current + 1;

  useEffect(() => {
    navigation.setOptions({
      title: (filterIsVisible? "Фильтр по жанрам" : (<View >
        <Text style={{color: "#FFF", fontSize: 18}}>{title}</Text>
        <Text style={{color: "#FFF",  fontSize: 10}}>{cutStr(newBooksFilter?.title)}</Text></View>)),
      headerRight: () => (
        <Icon.Button
          onPress={()=> {
            setFilterIsVisible(!filterIsVisible)}}
          name= "filter"
          color="#FFF"
          backgroundColor={Colors.prime}
        />
      )});
  }, [filterIsVisible]);

  useEffect(()=>{
    if(initRef.current){
      initRef.current = false;
    }else{
      setRefresh(false);
    }
  },[books])

  const handleLoadMore = () => {
    if (source !== "html" && !refresh && books.length && books.length% 20 === 0) {
      getNextPage();
      setRefresh(true);
    }
  };

  const onRefresh = () => {
    setRefresh(true);
  };


  return    <SafeAreaView><View>
    {filterVisibility.panel && <FilterPanel  setFilterVisibility={setFilterVisibility} mode={queryType === "newForWeek"? "single" : "multi"}  />}
    {filterIsVisible?  (<FilterList setFilterIsVisible={setFilterIsVisible} navigation={navigation}  route={route} />) :
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