import React, {useEffect, useState,useRef} from 'react'
import {FlatList, Text, View} from "react-native";
import BookItem from "./BookItem";

export default ({navigation, books, moreBooks}) => {

  const flatListRef = useRef(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(()=>{
    setRefresh(false);
  },[books])

  const handleLoadMore = () => {
    if (!refresh) {
      moreBooks();
      setRefresh(false);
    }
  };

  return    <View>
    <Text>Новые книги</Text>
    <FlatList
      ref={flatListRef}
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