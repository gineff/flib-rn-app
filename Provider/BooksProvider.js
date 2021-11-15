import React, { useContext, useState, useEffect, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {xmlParser, htmlParser, commentParser} from "../service/flibustaParser";
const proxyCorsUrl ="https://api.allorigins.win/raw?url=";
const serverUrl = "http://gineff-home.ddns.net:3000/books";
const BooksContext = React.createContext(null);

const getText = async (url)=> {
  console.log("url", 'http://flibusta.is'+url)
  return fetch(proxyCorsUrl+encodeURIComponent('http://flibusta.is'+url))
    .then(response=>response.text())
};

const BooksProvider = ({children, queryType, query, source, book})=> {

  console.log('book provider change');

  const [books, setBooks] = useState([]);
  const [filter, _setFilter] = useState(false);
  const initRef = useRef(true);
  const refPage = useRef(1);

  const setFilter = (value)=> {
    _setFilter(value);
    AsyncStorage.setItem("FILTERS", JSON.stringify(value));
  }

  const generateUrl = () => {
    const page = refPage.current;
    let url;

    if(queryType === "author"){
      url = "/opds/author/" + query + "/time"+"/"+(page-1);
    }else if(queryType === "sequence"){
      url =  "/opds/sequencebooks/"+query+"/"+(page-1);
    }else if(queryType === "genre") {
      url =  "/opds/new/" + (page-1)  + "/newgenres/" + query;
    }else if(queryType === "search") {
      url = '/opds/opensearch?searchType=books&searchTerm=' + query;
      return url;
    }else if(queryType === "popularForDay"){
      url =  `${serverUrl}/list/24/page/${page}`;
    }else if(queryType === "popularForWeek"){
      url =  `${serverUrl}/list/w/page/${page}`;
    }else if(queryType === "newForWeek" && filter?.newBooksFilter?.id){
      url =  "/opds/new/" + (page-1)  + "/newgenres/" + filter.newBooksFilter.id;
    }else if(queryType === "newForWeek"){
      url =  "/opds/new/" + (page - 1) + "/new/" ;
    }

    console.log('\x1b[36m%s\x1b[0m', "url", url);
    return url;
  };

  const getComments = async()=> {
    const text = await getText('/b/'+book.item.bid);
    const data = await commentParser(text);
    return  data;
  }

  const getDataFromOPDS = async ()=> {
    const url = generateUrl();
    const text = await getText(url);
    return xmlParser(text);
  }

  const getDataFromServer = async ()=> {
    return await fetch(generateUrl()).then(res=>res.json());
  }

  const getData = async(resetBooks)=> {
    //топ 100 списки парсяться с сайта flibusta и затем загружаются на сервер
    //новинки загружаются из OPDS бибилотеки
    const data = source ===  "opds"? await getDataFromOPDS() : await getDataFromServer();
    const _books = resetBooks? [] : books;
    setBooks([..._books, ...data]);
  }

  const getNextPage = (nextPage)=> {
    refPage.current = nextPage || refPage.current+1;
    getData()
  }

  useEffect(()=> {
      //избегаем срабатывания при инициализации filter
      if(initRef.current){
        initRef.current = false;
      }else{
        refPage.current = 1;
        getData(true);
      }

  }, [filter])

  useEffect(()=> {
    //source (html, opds) есть только у списков. Если у потомка нет source (например компонент Book), фильртры
    //загружать не нужно. Загрузка фильтров вызовет метод getData. для компонента Book это не нужно
    if(!source) return;
    AsyncStorage.getItem("FILTERS",(err, res)=> {
      _setFilter(res? JSON.parse(res) : {newBooksFilter: {title: "Все жанры", id: 0}, useFilter: false});
    })

  }, [])

  return (
    <BooksContext.Provider value={{books, getComments, getNextPage, filter, setFilter}}>
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