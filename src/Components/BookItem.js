import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Authors, Sequences, Cover, Content, Genres} from "./BookView"
import {Colors} from "../Styles"

const BookItem =  ({item, index, navigation, onGenreClick})=> {

  if(index === 0) console.log("BookItem render");
  const navigateBook = ()=> {
    navigation.navigate("Book",{item})
  }

  const {sequencesTitle, sequencesId, author, content, title, image, genre, year} = item;

  return (
      <View style={styles.listItem} >
        <TouchableOpacity  onPress = {navigateBook} style={{flexDirection: "row"}}>
          <View>
            <View style={styles.bookCoverNDateWrapper}>
                <Cover image={image} title={title}/>
                <Text style={styles.bookYear}>{year}</Text>
            </View>
          </View>
          <View style={styles.bookWrapper}>
            {/*title*/}
            <Text style={styles.bookTitle}>{(index+1)+". "+title}</Text>
            <Authors>{author}</Authors>
            <Sequences sequencesTitle={sequencesTitle} sequencesId={sequencesId}/>
            <Content>{content}</Content>
          </View>
        </TouchableOpacity>
        <View style={styles.listItemBottom}>
          <Genres onGenreClick={onGenreClick}>{genre}</Genres>
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

export default React.memo(BookItem)