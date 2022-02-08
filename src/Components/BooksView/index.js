import React, {useEffect, useState, useRef, useCallback} from 'react'
import {FlatList, Text, TouchableOpacity, View, Platform, StyleSheet, Dimensions} from "react-native";
import BookItem from "./BookItem";
import FilterView from "./FilterView";
import Icon from "react-native-vector-icons/Ionicons";
import {Colors, dimensions, containerWidth} from "../../Styles";
import {xmlParser, htmlParser, getText, cutString} from "../../service";
import {serverUrl, Collection} from "../../Data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Button} from "react-native-web";

const listQueryTypeToSave = [
  "newForWeek",
  "popularForWeek",
  "popularForDay",
  "searchByTitle"
]

const isQueryTypeToSave = (queryType)=> {
  return listQueryTypeToSave.includes(queryType)
  //return queryType === "newForWeek" || queryType === "popularForWeek" || queryType === "popularForDay" || queryType === "searchByTitle"
}

export default ({navigation, route})=> {

  const {title, source, queryType, query} = route.params;
  const [serverlessMode, setServerLessMode] = useState(false);
  const [books, setBooks] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [errors, setErrors] = useState([]);
  const flatListRef = useRef(null);
  const [filter, setFilter] = useState(null);
  const [filterIsVisible, setFilterIsVisible] = useState(false);
  const refPage = useRef(1);
  const refInit = useRef(true);
  const start = useRef(new Date());
  const collection = useRef();
  const { width, height } = Dimensions.get('window');
  let isServerlessMode = false;

  console.log(`render ===============BooksView============== ${new Date()-start.current}`, `refresh= ${refresh}`, `books length ${books?.length}`);

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
    }else if( queryType === "searchByTitle"){
      //console.log("title", createTwoLevelTitle("Поиск по названию", query))
      header.headerTitle = () => (createTwoLevelTitle("Поиск по названию", query))
      //createTwoLevelTitle("Поиск по названию", "название");
      //header.title = createTwoLevelTitle("Поиск по названию", query)
    }else{
      if(filterIsVisible){
        header.title = "Фильтр по жанрам";
      }else if(!filter){
        header.title = title;
      }else{
        header.headerTitle = () => createTwoLevelTitle(title, filter?.title);
      }
    }

    navigation.setOptions(header);
  }

  const createTwoLevelTitle = (first, second)=> {
    return (<View>
      <Text style={{color: "#FFF", fontSize: 18}}>{cutString(first)}</Text>
      <Text style={{color: "#FFF",  fontSize: 10}}>{cutString(second)}</Text>
    </View>)
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
    {/*<Icon size={25} color="#FFF" name="filter"/>*/}
    {(Platform.OS === "web")? (<Text style={{fontSize:30}}>...</Text>) :
      (<Icon size={25} color="#FFF" name="ellipsis-vertical-sharp"/>)}
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
    //если значение фильтра поменялось, значит фильтры нужно скрыть
    setFilterIsVisible(false);
    //начинается загрузка данных с новым фильтром, поэтому
    setRefresh(true);

    if(source === "opds"){
      //начинаем загрузку из ods библитеки с новым свойством filter
      if(filter) collection.current.setOptions({queryType:"genre", queryId: filter.id, page: 1})
      else collection.current.setOptions({queryType, queryId: query, page: 1})
      console.log("get data - filter");
      getData(true);
    }else{
      //загружаем из хранилища список популярных, фильтруем его с новомым фильтром

      collection.current.storage.get(queryType).then((_books)=> {
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
    collection.current.setOptions({page: (collection.current.page+1)})
    console.log("get data - next page");

    getData()
  }

  const handleLoadMore = () => {
    //в браузере неверно работает onEndReached
    //todo в браузере
    //if(Platform.OS === "web") return;
    //refresh = true - уже идет загрузка. если books.length < 20 достигнут конец (последняя страница)
    if (!refresh && books.length && books.length% 20 === 0) {
      getNextPage();
      setRefresh(true);
    }
  };

  const onRefresh = () => {
    setRefresh(true);
  };

  //** get data methods

  const deferredBooks = ()=> {
    console.log("deferredBooks books", books)
  }

  const extendBooks = async ()=> {
    /*return new Promise((resolve)=>{
      setTimeout(() => {console.log("extended books"); resolve("ignored")}, 30000);
    })*/
    //setTimeout(function() {console.log("extended books", books);}, 5000);
    for(let book of books) {
      if(book.simple){
        const bid = book
        if(!book.author[0].id) continue;
        const foundBook = await collection.current.findBookByAuthor(book.bid, book.author[0].id);
        // if(!foundBook) continue;
        const _books = books.map(el=> el.bid === book.bid
          ? (foundBook
            ? foundBook
            : (el.simple = false) || el)
          : el
        );
        await collection.current.storage.set(queryType, _books)
        setBooks(_books);
        break;
      }
    }
  }

  const handleServerlessMode = ()=> {
    isServerlessMode = true;
    setServerLessMode(true);

    return true;
  }

  const getOPDSData = async ()=> {
    return await collection.current.getPage();
  }

  const getListDataFromSite = async ()=> {
    return  await collection.current.getListFromSite(queryType);
  }

  const getListDataFromServer  = async ()=> {
    return await collection.current.getList(queryType);
  }

  const getListData = async ()=> {
    return await  getListDataFromServer() || handleServerlessMode() && await getListDataFromSite()
  }

  const getDataFromStorage = async ()=> {
    // arrayOfId = await collection.current.storage.get(queryType) ;
    // data = await collection.current.storage.get(arrayOfId) ;
    return  await collection.current.storage.get(queryType) ;
  }

  /*
  const extendListFromStorage = async (data)=> {

    const savedData = await collection.current.storage.get(queryType);

    if(savedData){
      const map = new Map();

      data.forEach(el=>map.set(el.bid,el));
      savedData.forEach(el=>map.set(el.bid,el));

      return data.map(el=>map.get(el.bid))
    }else{
      return  data;
    }

  }
*/
  const getData = async (resetBooks= false)=> {
    //два типа источника данных: библиотека opds flibusta (opds) и список популярных книг с сайта (html) /stat/w и
    // /stat/24. Списки сначала загружаются из Локального Хранилища , затем в фоне данные загружаются с сервера, либо
    //если сервер не доступен, с сайта Флибусты загружаются списки и затем ищутся книги в opds бибилиотеке

    let data;
    //если первый запуск и данные сохраняются
    if(refInit.current && isQueryTypeToSave(queryType)){
      data = await getDataFromStorage();
    }else{
      data = (source ===  "opds")
        ? await getOPDSData()
        : await getListData();

      if(!isServerlessMode && isQueryTypeToSave(queryType)) {
        await collection.current.storage.set(queryType, data)
      }
    }
    // todo: if data instanceof Error

    const _books = resetBooks? [] : books;
    setBooks([..._books, ...data]);


    //первоначально данные загружаются из локального хранилища. Далее инициализируем загрузку с сервера

    if(refInit.current){
      refInit.current = false;
      if(isQueryTypeToSave(queryType))  getData()
    }
  }

  /*END get data methods  */

  useEffect(()=> {
    collection.current = new Collection({source, queryType, queryId: query});
    console.log("get data - init");

    getData();


  },[])

  useEffect(()=>{
    if(!refInit.current){
      setRefresh(false);
      if(books.length && serverlessMode) extendBooks();
    }
  },[books])

  return <View style={styles.container}>
    <View style={[styles.booksWrapper, {maxWidth: containerWidth}]}>
    {!!errors.length && (<Text>{errors.map(el=> `${el.message}\r\n`)}</Text>)}
    {filterIsVisible? (<FilterView filter={filter} setFilter= {setFilter} collection={collection.current} queryType={queryType} source={source}/>) :
      (<FlatList
        ref={flatListRef}
        onRefresh={onRefresh}
        refreshing={refresh}
        data={books}
        onEndReached={()=>{Platform.OS !== "web" && handleLoadMore()}}
        onEndReachedThreshold={0.1}
        keyExtractor={(item, index) => "key"+index}
        renderItem={({item, index}) => {
          return (<BookItem item={item} index={index} navigation={navigation} onGenreClick={onGenreClick}/>);
        }}
      />)}
  </View>
    {(Platform.OS === "web") && (<View><Button onPress={handleLoadMore} title="Load more"/></View>)}
  </View>
}

const styles = StyleSheet.create({
  container: {
    alignItems : "center"
  },
  booksWrapper: {

  },
  filterIcon: {
    color:"#FFF", marginRight: 10, padding: 5, paddingHorizontal: 10, borderRadius: 5,
  }
})

export {BookItem, FilterView}
//export default BooksView;
