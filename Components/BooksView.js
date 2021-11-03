import React, {useEffect, useState,useRef} from 'react'
import {FlatList, Text, View, Button, TouchableOpacity, TouchableHighlight} from "react-native";
import BookItem from "./BookItem";
import {useBooks} from "../Provider/BooksProvider";
import FilterView from "./FilterView";
import CheckBox from "./CheckBox";
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "../Styles";

export default ({navigation, route}) => {

  const uid = Math.floor(Math.random() * 100);
  const {books, moreBooks} = useBooks();
  const [refresh, setRefresh] = useState(true);
  const flatListRef = useRef(null);
  const initRef = useRef(true);
  const {title, source} = route.params;
  const runFilterCounter  = useRef(0);
  const [filterIsVisible, setFilterVisible] = useState(false);
  console.log(uid, "booksView render", runFilterCounter.current )
  runFilterCounter.current = runFilterCounter.current + 1;

  useEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => (
        <Icon.Button
          onPress={
            /*() => {navigation.navigate("Filter")}*/
            ()=> setFilterVisible(true)
          }
          name="filter"
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
    {filterIsVisible &&
    <View style={{ backgroundColor: Colors.prime, flexDirection: "row", justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 15}}>
      <TouchableHighlight>
        <CheckBox style={{color:"#FFF"}}>
          <Text style={{color:"#FFF", paddingLeft: 5, fontSize: 18}}>Использовать фильр </Text>
        </CheckBox>
      </TouchableHighlight>

      <TouchableOpacity  title="OK"   style={{borderWidth:  1, borderColor: "#FFF",
        borderRadius: 5, padding: 7, paddingHorizontal: 15, height: 35}}   color={Colors.prime} >
        <Text>OK</Text>
      </TouchableOpacity>
      <View style={{ justifyContent: "flex-end", justifySelf: "flex-end"}}>
        <Icon.Button
          onPress={()=>navigation.navigate("Filter")}
          name="options"
          backgroundColor={Colors.prime}
          size={30}
          color="#FFF"/>
      </View>

    </View>}
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