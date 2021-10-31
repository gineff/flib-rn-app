import React, { useState, useEffect, useRef } from "react";
import { Button, Text, View, SectionList } from "react-native";
import  genres from "../Data/genres.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default  ({navigation, isModalVisible, setModalVisible})=> {

  const filter = useRef([]);

  useEffect(()=> {
    AsyncStorage.getItem("GENRES_FILTER", (err, item)=> {
      filter.current = item ? JSON.parse(item) : [];
    })
  },[])


  const Item = ({ children, id, style, checked}) => (
    <View style={{...style, flexDirection: "row"}}>
      <GenreCheckBox id={id}  checked={checked}/>
      <Text style={{alignSelf: "center"}}>{children}</Text>
    </View>
  );



  return (
    <View style={{ flex: 1 }}>

        <View style={{ flex: 1 }}>
          <Text>Жанр</Text>


        </View>
    </View>
  );
}

