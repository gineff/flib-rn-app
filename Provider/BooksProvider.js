import React, { useContext, useState, useEffect, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {xmlParser, htmlParser, commentParser} from "../service/flibustaParser";
const proxyCorsUrl ="https://api.allorigins.win/raw?url=";
const BooksContext = React.createContext(null);

const getText = async (url)=> {
  console.log("url", 'http://flibusta.is'+url)
  return fetch(proxyCorsUrl+encodeURIComponent('http://flibusta.is'+url))
    .then(response=>response.text())
};

const BooksProvider = ({children, queryType, query, source, book})=> {

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);

  const generateUrl = () => {

    console.log(queryType, query)
    let url;
    if(queryType === "author"){
      url = "/opds/author/" + query + "/time"+"/"+(page-1);
    }else if(queryType === "sequence"){
      url =  "/opds/sequencebooks/"+query+"/"+(page-1);
    }else if(queryType === "genre") {
      url =  "/opds/new/" + page  + "/newgenres/" + query;
    }else if(queryType === "search") {
      url = '/opds/opensearch?searchType=books&searchTerm=' + query;
      return url;
    }else if(queryType === "popularForDay"){
      url =  "/stat/24";
    }else if(queryType === "popularForWeek"){
      url =  "/stat/w";
    }else if(queryType === "newForWeek"){
      url =  "/opds/new/" + (page - 1) + "/new/" ;
    }
    return url;
  };

  const extendFromStorage = async(books)=> {
    const keys = books.map(book=>`BOOK-${book.bid}`);
    const values = await AsyncStorage.multiGet(keys);
    const _books = books.map(book=> {
      const matched = values.filter(el=> el[0] === `BOOK-${book.bid}`)[0];
      if(matched[1] === null) return book;
      else return JSON.parse(matched[1]);
    });
    return  _books;
  }

  const searchBookByAuthor = async (book, searchPage = 1)=> {
    console.log("search in opds by author", searchPage, book.title);
    if(!book.author[0].id) return undefined;
    const text = await getText("/opds/author/" + book.author[0].id + "/time"+"/"+(searchPage-1));
    const data = xmlParser(text);
    const filteredData = data.filter(el => el.bid === book.bid)[0];
    if(data.length === 20 && filteredData === undefined){
      return await searchBookByAuthor(book, ++searchPage);
    }else{
      return filteredData;
    }
  };

  const extendFromOPDS = async ()=> {
    console.log("extendFromOPDS");
    for(let book of books){
      if(book.simple){
        const foundBook = await searchBookByAuthor(book);
        if(foundBook){
          AsyncStorage.setItem('BOOK-'+book.bid, JSON.stringify(foundBook));
        }
        setBooks(books.map(el=> el.bid === book.bid?
          (foundBook? foundBook : (el.simple = false) || el) :
          el
        ))
        break;
      }
    }
  }

  const getComments = async()=> {
    const text = await getText('/b/'+book.item.bid);
    const data = await commentParser(text);
    return  data;


  }

  const getData = async()=> {
    const url = generateUrl();
    const text = await getText(url);
    const data = source ===  "opds"? await xmlParser(text) : await extendFromStorage(await htmlParser(text));
    setPage(page+1);
    setBooks([...books, ...data]);
  }

  useEffect(()=> {
    if(books.length && source === "html"){
      console.log("extend");
      setTimeout(extendFromOPDS, 300)
    }
  }, [books])

  useEffect(()=> {
    getData()
  }, [])

  const moreBooks = ()=> {
    //если это Book загружать книги не нужно
    source && getData()
  }

  return (
    <BooksContext.Provider value={{books, moreBooks, getComments}}>
      {children}
    </BooksContext.Provider>
  );
}

const useBooks = () => {
  const books = useContext(BooksContext);
  if (books == null) {
    throw new Error("useBooks() called outside of a BooksProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return books;
};

export { BooksProvider, useBooks };