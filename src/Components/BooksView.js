import React, {useEffect, useState,useRef, useCallback} from 'react'
import {FlatList, Text, TouchableOpacity, View, Platform, StyleSheet} from "react-native";
import BookItem from "./BookItem";
import FilterView from "./FilterView";
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "../Styles";
import {xmlParser, htmlParser, getText, cutString} from "../service";
import {serverUrl} from "../Data";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({navigation, route})=> {

  const {title, source, queryType, query} = route.params;

  const [books, setBooks] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const flatListRef = useRef(null);
  const [filter, setFilter] = useState(null);
  const [filterIsVisible, setFilterIsVisible] = useState(false);
  const refPage = useRef(1);
  const refInit = useRef(true);

  const listName = `LIST-${queryType === "popularForWeek"? "W" : "24"}`

  console.log("render BooksView");

  //** header methods

  //при первоначальной загрузке (вызывается инициализацией стейта фильтр)
  // открытии скрина автор и серия, книги еще не загружены.
  //при открытиии - закрытии фильтра useEffect(filterIsVisible)
  //при установке фильтра useEffect(filter)
  const setTitle = ()=> {
    const header = {};


    if(queryType === "author"){
      header.title = books[0]?.author[0].name;
    }else if( queryType === "sequence"){
      header.title =  books[0]?.sequencesTitle[0];
    }else{
      header.title = filterTitle
    }

    navigation.setOptions(header);
  }

  //** filter methods

  //название в заголовке, в случае если выбран фильтр (жанр)
  const filterTitle = (filterIsVisible? "Фильтр по жанрам" : (<View>
    <Text style={{color: "#FFF", fontSize: 18}}>{cutString(title)}</Text>
    {filter && (<Text style={{color: "#FFF",  fontSize: 10}}>{cutString(filter?.title)}</Text>)}
    </View>))

  //кнопка "фильтр" в HeaderRight
  const filterIcon = <TouchableOpacity
    style={{...styles.filterIcon, backgroundColor: filterIsVisible? Colors.secondary : Colors.prime}}
    onPress={()=>{setFilterIsVisible(!filterIsVisible)}}>
    <Icon size={25} color="#FFF" name="filter"/>
  </TouchableOpacity>

  const setHeaderRight = ()=> {
    navigation.setOptions({headerRight : () => filterIcon});
  }

  const onGenreClick = useCallback((genre)=>{
      setFilter(genre);
  },[source])

  //обработка изменения видимости фильтра, при нажатии на кнопку фильтр в заголовке
  useEffect(()=> {
    setHeaderRight();
  }, [filterIsVisible])

  useEffect(()=> {setTitle()},[books, filterIsVisible])

  //жанр книги в качестве фильтра
  useEffect(()=> {
    if(refInit.current) return;
    setFilterIsVisible(false);
    setRefresh(true);

    if(source === "opds"){
      //начинаем загрузку из ods с новым свойством filter
      getData(true);
    }else{
      //загружаем из хранилища список популярных, фильтруем его с новомым фильтром
      getDataFromStorage().then((_books)=> {
        if(filter) {
          _books = _books.filter((el)=> {
            let match=false;
            el.genre.forEach(e=> {if(filter.title === e) match = true })
            return match;
          })
        }
        setBooks(_books);
      })
    }
  }, [filter])

  //** data update methods

  const getNextPage = (nextPage)=> {
    refPage.current = nextPage || refPage.current+1;
    getData()
  }

  const handleLoadMore = () => {
    if(Platform.OS === "web") return;
    if (!refresh && books.length && books.length% 20 === 0) {
      getNextPage();
      setRefresh(true);
    }
  };

  const onRefresh = () => {
    setRefresh(true);
  };

  //** get data methods

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
    }else if(queryType === "popularForDay" || queryType === "popularForWeek"){
      url =  `/stat/${queryType === "popularForWeek"? "w" : "24"}`;
    }else if(queryType === "newForWeek" && filter){
      url =  "/opds/new/" + (page-1)  + "/newgenres/" + filter.id;
    }else if(queryType === "newForWeek"){
      url =  "/opds/new/" + (page - 1) + "/new/" ;
    }
    console.log('\x1b[36m%s\x1b[0m', "url", url);
    return url;
  };

  const getDataFromOPDS = async ()=> {
    let url = generateUrl();
    const text = await getText(url);
    return xmlParser(text);
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


  const deferredLoadFromServer = async ()=> {
    const point0 = new Date();
    let list, newBooksID;

    try{
      //получаем список id с сервера
      newBooksID = await fetch(`${serverUrl}/list/${queryType === "popularForWeek"? "w" : "24"}`)
          .then(res=>res.json());
      console.log("загрузка с сервера", newBooksID.slice(0,3)+"...", new Date()-point0);
    }catch(e){
      //получаем данные с сайта
      const url = generateUrl();
      const text = await getText(url);
      list = await htmlParser(text);
      newBooksID = list.map(el=>el.bid);
      console.log("newBooksID", newBooksID)
    }

    //получаем спиок из локального хранилища
    let listOfBooks = await getDataFromStorage();

    /*const listName = `LIST-${queryType === "popularForWeek"? "W" : "24"}`;
    const listOfBooksStr = await AsyncStorage.getItem(listName) ;
    const listOfBooks =   listOfBooksStr === null ? [] : JSON.parse(listOfBooksStr);*/

    listOfBooks = listOfBooks.reduce((arr,el)=>{if(el){arr.push(el)} return arr}, [])

    //получаем список id из списка из локального хранилища
    const listOfBooksId = listOfBooks.map(el=>el.bid);
    console.log("загрузка из хранилища", new Date()-point0);

    //сравнение и подготовка списка id недостающих книг
    const ListOfMissingBooksId = newBooksID.filter(id=> !listOfBooksId.includes(id));
    console.log("подготовка списка к запросу", ListOfMissingBooksId, new Date()-point0);

    // запрос недостающих книг с сервера
    //if(ListOfMissingBooksId.length>0){
    let newBooks = [];
    try{
      newBooks = await fetch(serverUrl, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body:  JSON.stringify(ListOfMissingBooksId)
      }).then(res=> res.json());
      console.log("запрос на сервер", new Date()-point0);

    }catch(e){
      for(let id of ListOfMissingBooksId){
        const book = list.filter(el=>el.bid === id)[0];
        const foundBook = await searchBookByAuthor(book);
        if(foundBook) newBooks.push(foundBook);
      }
    }

    //объединяем списки используя Map
    const map = new Map();
    listOfBooks.forEach(el=> map.set(el.bid, el))
    newBooks.forEach(el=> map.set(el.bid, el))

    //создаем список книг
    //на флибусте бывает так, что в популярных списках у книги один id, а в книгах у автора другой.
    //это происходит из-за того, что книгу обновили, а в списках осталась прежняя версия
    list = newBooksID.reduce((arr, id)=> {if(map.has(id)) {arr.push( map.get(id))} return arr},[])
    console.log("обработка результатов", new Date()-point0);

    //сохранение списка в локальном хранилище
    await AsyncStorage.setItem(listName, JSON.stringify(list))

    setBooks(list);

  }


  const getDataFromStorage = async ()=> {

    const listOfBooksStr = await AsyncStorage.getItem(listName) ;
    return  listOfBooksStr === null ? [] : JSON.parse(listOfBooksStr);
  }

  const getData = async (resetBooks= false)=> {
    const data = source ===  "opds"? await getDataFromOPDS() : await getDataFromStorage();
    const _books = resetBooks? [] : books;
    setBooks([..._books, ...data]);
    if( source !==  "opds") deferredLoadFromServer();
  }

  /*END get data methods  */

  useEffect(()=> {
    getData();
  },[])

  useEffect(()=>{
    console.log("books updated");
    console.log("set refresh false");

    /*TODO refresh false on book loading*/
    if(refInit.current){
      refInit.current = false;
    }else if(refresh){
      setRefresh(false);
    }
  },[books])

  return   <View style={{backgroundColor: Colors.secondaryTint}}>

    {filterIsVisible? (<FilterView filter={filter} setFilter= {setFilter} queryType={queryType} source={source}/>) :
      (<FlatList
      ref={flatListRef}
      onRefresh={onRefresh}
      refreshing={refresh}
      data={books}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      keyExtractor={(item, index) => "key"+index}
      renderItem={({item, index}) => {
        return (<BookItem book={{item, index}} navigation={navigation} onGenreClick={onGenreClick}/>);
      }}
    />)}
  </View>
}
const styles = StyleSheet.create({
  filterIcon: {
    color:"#FFF", marginRight: 10, padding: 5, paddingHorizontal: 10, borderRadius: 5,
  }
})