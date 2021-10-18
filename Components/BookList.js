import React, {useEffect, useState} from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import matchAll from 'string.prototype.matchall';
const ANIMALS = ['Dog', 'Cat', 'Chicken', 'Dragon', 'Camel','Dog', 'Cat', 'Chicken', 'Dragon', 'Camel','Dog', 'Cat', 'Chicken', 'Dragon', 'Camel','Dog', 'Cat', 'Chicken', 'Dragon', 'Camel'];
const proxyCorsUrl ="https://api.allorigins.win/raw?url=";
export default  ()=> {

  const parseText = async ()=> {

  }

  const getText = async ()=> {
    return fetch(proxyCorsUrl+encodeURIComponent('http://flibusta.is/stat/w'))
        .then(response=>response.text())

  }

  const getBooks = async ()=> {
    const text = await getText() ;
    //console.log(text);
    const matches = Array.from(matchAll(text,/<a href="\/a\/(.*?)">(.*?)<\/a> - <a href="\/b\/(.*?)">(.*?)<\/a>/g));
    const _books = matches.map(el=>({aid:el[1],bid:el[3],author:el[2],title:el[4]}))
    //console.log(_books);
    setBooks(_books)
   //const links = matches.slice(0,10).map(el=>({id:el[1],title:el[2]}));
   //console.log(links);
   //const books = await parseText(text);
  }

  const [books, setBooks] = useState([])

  useEffect( ()=>{
//    getBooks()


  },[])

  return (
    <FlatList data={books}
      renderItem={(book) => {
        const item = book.item;
        console.log(book.item);

        return (
            <View style={styles.listItem}  key={book.index}>
              <Text>Автор: {item.author}</Text>
              <Text>{item.title}</Text>
            </View>
        );
      }}
    />

  )

}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: 'orange',
    borderWidth: 1,
    borderColor: '#333',
    padding: 25,
  }
});