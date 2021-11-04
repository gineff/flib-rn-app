import React, {useEffect, useState,useRef} from 'react'
import {FlatList, Text, View, Button, TouchableOpacity, TouchableHighlight} from "react-native";
import BookItem from "./BookItem";
import {useBooks} from "../Provider/BooksProvider";
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "../Styles";
import FilterPanel from "./FilterPanelView";
import { useFocusEffect } from '@react-navigation/native';

export default ({navigation, route}) => {

  const uid = Math.floor(Math.random() * 100);
  const {books, moreBooks} = useBooks();
  const [refresh, setRefresh] = useState(true);
  const flatListRef = useRef(null);
  const initRef = useRef(true);
  const {title, source, queryType} = route.params;
  const runFilterCounter  = useRef(0);
  const [filterIsVisible, setFilterVisible] = useState(false);
  console.log(uid, "booksView render", runFilterCounter.current )
  runFilterCounter.current = runFilterCounter.current + 1;

  useEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => (
        <Icon.Button
          onPress={()=> {setFilterVisible(true);}}
          name= {filterIsVisible? "chevron-up-outline":  "filter"  }
          color="#FFF"
          backgroundColor={Colors.prime}
        />
      )});
  }, []);

  useEffect(()=>{
    if(initRef.current){
      initRef.current = false;
    }else{
      setRefresh(false);
    }
  },[books])



  const handleLoadMore = () => {
    if (source !== "html" && !refresh) {
      moreBooks();
      setRefresh(true);
    }
  };

  const onRefresh = () => {
    setRefresh(true);
  };


  return    <View>
    {filterIsVisible && <FilterPanel navigation={navigation} queryType={queryType}/>  }
    <FlatList
      ref={flatListRef}
      onRefresh={onRefresh}
      refreshing={refresh}
      data={books}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      keyExtractor={(item, index) => "key"+index}
      renderItem={(book) => {
        return (<BookItem book={book} navigation={navigation}/>);
      }}
    />
  </View>
}