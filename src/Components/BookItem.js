import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Authors, Sequences, Cover, Content, Genres} from "./BookView"
import {Colors} from "../Styles"

export default ({book, navigation, onGenreClick})=> {
  const {item, index} = book;

  const navigateBook = ()=> {
    navigation.navigate("Book",{book})
  }

  return (
      <View style={styles.listItem} >
        <TouchableOpacity  onPress = {navigateBook} style={{flexDirection: "row"}}>
          <View>
            <View style={styles.bookCoverNDateWrapper}>
                <Cover item={item}/>
                <Text style={styles.bookYear}>{item?.year}</Text>
            </View>
          </View>
          <View style={styles.bookWrapper}>
            {/*title*/}
            <Text style={styles.bookTitle}>{(index+1)+". "+item.title}</Text>
            <Authors>{item.author}</Authors>
            <Sequences item={item}/>
            <Content>{item.content}</Content>
          </View>
        </TouchableOpacity>
        <View style={styles.listItemBottom}>
          <Genres onGenreClick={onGenreClick}>{item.genre}</Genres>
        </View>
      </View>
  )
}


const styles = StyleSheet.create({

  bookCoverNDateWrapper: {
    marginLeft:5,
    marginTop:5,
    borderRadius: 5,
    backgroundColor: Colors.secondary
  },

  bookYear: {
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 14,
    minHeight: 18,
    paddingBottom: 5,
  },
  bookWrapper: {
    flexDirection: "column", paddingHorizontal: 0,  flex: 1, marginLeft: 10
  },

  bookTitle: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 18,
    paddingVertical: 4,
    color: "#000",
  },


  listItem: {
    flex:1,
    margin: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#FFF"
  },
  listItemBottom: {
    margin: 5,
    flexDirection: "row",
    flexWrap: "wrap",
  }
});