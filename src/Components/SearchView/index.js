import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, TextInput, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import {Colors} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationContext } from '@react-navigation/native';
import Collection from "../../Data/collection";

const options = [
  { label: "Поиск книг", value: "title" },
  { label: "Поиск автора", value: "author" },
];

const AuthorItem = ({genre, setFilter})=> {
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

export default ({ navigation, route})=> {

  const [searchStr, setSearchStr] = useState("");
  const [searchType, setSearchType] = useState("");
  const [authors, setAuthors] = useState([]);
  const collection = new Collection({queryType: "searchByAuthor", source: "opds", page: 1})


/*
  const getAuthors = async ()=> {
    const counter = [ 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const _authors = await collection.getAuthors(1);
    setAuthors(_authors);
    for(let page of counter) {
      _authors.push( ...(await collection.getAuthors(page)));
      if(!_genres || _genres.length < 20) break;
    }
    console.log('set genres')
    setGenres(_genres);
  }*/

  const onSearchPress = ()=> {

    navigation.navigate("BooksList", {query: searchStr,   queryType: "search", source: "opds"})

    /*if(searchType === "title"){
      navigation.navigate("BooksList", {query: searchStr,   queryType: "searchByTitle", source: "opds"})
    }else{

      //navigation.navigate("Authors", {query: searchStr,   queryType: "searchByAuthor", source: "opds"})
    }*/

  }

  return <ScrollView>
    <View style={styles.container}>
      <SwitchSelector
        options={options}
        initial={0}
        borderRadius = {20}
        height={50}
        hasPadding
        textContainerStyle = {{width: 150}}
        buttonColor={Colors.secondary}
        onPress={value => setSearchType}
      />
      <TextInput
        style={styles.input}
        onChangeText={setSearchStr}
        value={searchStr}
      />
      <Icon.Button name="search" backgroundColor={Colors.prime} size={30} borderRadius = {20} onPress={onSearchPress} >
        <Text style={{  fontSize: 15, color: "#FFF", width: "90%"}}>
          Поиск
        </Text>
      </Icon.Button>
    </View>
  </ScrollView>
}


const styles = StyleSheet.create({
  container: {
    alignItems : "center",
    padding: 15
  },
  input: {
    backgroundColor: "#FFF",
    width: "100%",
    height: 50,
    margin: 12,
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    marginBottom: 40
  },
})