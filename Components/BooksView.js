import React, {useEffect, useState,useRef} from 'react'
import {FlatList, Text, View} from "react-native";
import BookItem from "./BookItem";
import {useBooks} from "../Provider/BooksProvider";

export default ({navigation, route}) => {

  const {books, moreBooks} = useBooks();
  const flatListRef = useRef(null);
  const [refresh, setRefresh] = useState(true);
  const {title, source} = route.params;

  useEffect(() => {
    navigation.setOptions({title});
  }, []);

  useEffect(()=>{
    setRefresh(false);
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
    <Text>Новые книги</Text>
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