import {xmlParser, fb2Parser, htmlParser} from "../service";
import AsyncStorage from "@react-native-async-storage/async-storage";
const proxyCorsUrl = "https://api.allorigins.win/raw?disableCache=1&url=";
const opdsCatalog = "http://flibusta.is";
const serverUrl = "http://gineff.ddns.net:3000/books";

const cache = new Map();
const maxCacheAge = 24*60*60*1000;

const request = async (url, options) => {
  console.log("url", proxyCorsUrl+encodeURIComponent(url));
  const now = new Date();

  const key = `cache-${url}`;
  //const cache = JSON.parse(await AsyncStorage.getItem("cache") || {});
  //let value = cache[url];
  let value = JSON.parse(await AsyncStorage.getItem(key));

  const age = new Date(value?.age) ;

  /*console.log("now", now)
  console.log("age",  age)
  console.log("now - age", now - age)
  console.log("options.cache",  options.cache)
  console.log("now - age > options.cache",  now - age > options.cache)*/
  if(!value || (now - age > options.cache)){
    const res = await fetch(proxyCorsUrl+encodeURIComponent(url));
    if(res.status !== 200) return new Error("server error");
    const text = await res.text();
    value = {text, age: now}   ;
  }

  //const newCache = {...cache, [url]: value}
  console.log("set", key);
  AsyncStorage.setItem(key, JSON.stringify(value));
  return  value.text;
}

const updateCache = async ()=> {
  const now = new Date();
  await AsyncStorage.removeItem("cache");
  const keys = await AsyncStorage.getAllKeys();
  console.log("keys", keys);
  const cacheKeys = keys.filter(key=> key.slice(0,5) === "cache");
  console.log("cacheKeys", cacheKeys)
  for(let key of cacheKeys) {
    const value = await AsyncStorage.getItem(key);
    if(now - new Date(value.age) < maxCacheAge) {
      console.log("delete cache - key", key)
      await AsyncStorage.removeItem(key);
    }
  }
  await AsyncStorage.removeItem("cache");

  /*const cache = JSON.parse(await AsyncStorage.getItem("cache")) || {};
  const updatedCache = {};

  for(let key in cache){
    const el = cache[key];
    if(now - new Date(el.age) < maxCacheAge){updatedCache[key]= el}
  }
  AsyncStorage.setItem("cache", JSON.stringify(updatedCache));*/
}

const Collection = class {
  constructor(options) {
    this.page = 1;
    this.setOptions(options);
    updateCache()
  }

  setOptions (options) {
    Object.assign(this, options);
  }

  async request (options = {}) {
    console.log("request",this)
    const {queryType = this.queryType, queryId = this.queryId, page = this.page} = options;
    switch (queryType) {
      case "author":
        return await request(`${opdsCatalog}/opds/author/${queryId}/time/${(page-1)}`, {cache: 15*60*1000});
      case "sequence":
        return await request(`${opdsCatalog}/opds/sequencebooks/${queryId}/${page-1}`, {cache: 15*60*1000});
      case "newForWeek":
        return await request(`${opdsCatalog}/opds/new/${page-1}/new`,  {cache: 5*60*1000});
      case "genre":
        return await request(`${opdsCatalog}/opds/new/${page-1}/newgenres/${queryId}`, {cache: 5*60*1000});
      case "genres":
        return await request(`${opdsCatalog}/opds/newgenres/${page-1}`,{cache: 3*60*60*1000});
      case "listFromSite":
        return await request(`${opdsCatalog}/stat/${queryId}`, {cache: 60*60*1000});
      case "search":
        return await request(`${opdsCatalog}/opds/opensearch?searchType=books&searchTerm=${queryId}&pageNumber=${page-1}`,{cache: 30*1000});
      case "searchByTitle":
        return await request(`${opdsCatalog}/opds/search?searchType=books&searchTerm=${queryId}&pageNumber=${page-1}`,{cache: 30*1000});
      case "searchByAuthor":
        return await request(`${opdsCatalog}/opds/search?searchType=authors&searchTerm=${queryId}&pageNumber=${page-1}`,{cache: 30*1000});

    }
  }

  parse (text, type) {
    switch (type) {
      case "opds": return xmlParser(text);
      case "html": return htmlParser(text)
    }
  }

  async author(id, page= 1) {
    this.page = page;
    this.queryType = "author";
    this.queryId = id;
    return this.parse(await this.request(),"opds");
  }

  async sequence(id, page = 1) {
    this.page = page;
    this.queryType = "sequence";
    this.queryId = id;
    return this.parse(await this.request(),"opds");
  }
  async getAuthors(page) {
    /*return this.parse(await this.request({queryType: "searchByAuthor", page}), "opds")
      .map(el=> ({id: el.genreId, title: el.title, count: el.content.split(" ").shift()}));*/
  }

  async getGenres(page) {
    /*todo
    *  загрузка с сервера (на сервере обнавляется раз в 6 часов)
    * если загрузка с сайта, то постепенная загрузка, не ожидая когда загрузится весь список
    * */

   // if(cache.has("genres")) return cache.get("genres");

    const genres = this.parse(await this.request({queryType: "genres", page}), "opds")
      .map(el=> ({id: el.genreId, title: el.title, count: el.content.split(" ").shift()}));


/*    const genres = this.parse(await this.request({queryType: "genres"}), "opds")
      .map(el=> ({id: el.genreId, title: el.title, count: el.content.split(" ").shift()}))*/

    //cache.set("genres", genres);
    return genres;

  }

  async newForWeek(page = 1) {
    this.page = page;
    this.queryType = "newForWeek";
    return this.parse(await this.request(),"opds");
  }

  async getListFromSite(name) {

    const id = (name === "popularForWeek")? "w" : "24";
    const text = await this.request({queryType: "listFromSite", queryId: id}) || "";
    const listFromSite = this.parse(text, "html") || [];
    const savedData = await this.storage.get(name);
    //console.log("listFromSite", listFromSite);
    if(savedData){
      const map = new Map();

      listFromSite.forEach(el=>map.set(el.bid,el));
      savedData.forEach(el=>map.set(el.bid,el));
      //console.log("map",map)
      return listFromSite.map(el=>map.get(el.bid))

    }else{
      return listFromSite
    }



  }

  async getList(name) {

    //return false;
    const detail = true;
    const id = (name === "popularForWeek")? "w" : "24";
    const savedList = await this.storage.get(name);

    //1.
    //получаем список id с сервера
    let newBooksID, popularBooks, listFromSite;
    try {
      const res = await fetch(`${serverUrl}/list/${id}`);
      if(res.status !== 200) throw new Error("");
      popularBooks = await res.json();
      newBooksID = popularBooks && popularBooks.map(el => el.bid)

    }catch(e) {
      return false;
    }

    if(detail) console.log(1, "new books", newBooksID )

    //2.
    //получаем список id из локального хранилища
    const listOfBooksId = savedList.map(el=>el.bid);
    if(detail) console.log(2, "listOfBooksId", listOfBooksId )


    //3.
    //сравнение и подготовка списка id недостающих книг
    const ListOfMissingBooksId = newBooksID.filter(id=> !listOfBooksId.includes(id));
    if(detail) console.log(3, "ListOfMissingBooksId", ListOfMissingBooksId )

    //4. запрос недостающих книг + обновление рейтингов
    let newBooks = [];

    if(ListOfMissingBooksId.length !== 0) {
      try{
        // запрос недостающих книг с сервера
        newBooks = await fetch(serverUrl, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body:  JSON.stringify(ListOfMissingBooksId)
        }).then(res=> res.json())
      }catch(e){
        //или запрос недостающих книг с сайта
        return false;
        /*for(let id of ListOfMissingBooksId){
          const book = listFromSite.filter(el=>el.bid === id)[0];
          const foundBook = await this.findBookByAuthor(book.bid, book?.author[0]?.id, 1);
          if(foundBook) newBooks.push(foundBook);
        }*/
      }
    }
    if(detail) console.log(4, "newBooks" )


    //5.
    //объединяем списки используя Map
    const map = new Map();
    savedList.forEach(el=> map.set(el.bid, el))
    //добавляем оценки
    if(popularBooks) {
      popularBooks.forEach(el=> {
        if( map.has(el.bid)) map.set(el.bid, {...map.get(el.bid), ...el})
      })
    }
    newBooks.forEach(el=> map.set(el.bid, el))


    //6.
    //создаем список книг
    //на флибусте бывает так, что в популярных списках у книги один id, а в книгах у автора другой.
    //это происходит из-за того, что книгу обновили, а в списках осталась прежняя версия
    const list = newBooksID.reduce((arr, id)=> {if(map.has(id)) {arr.push( map.get(id))} return arr},[])
    if(detail) console.log(6, "list" )



    //7.
    //сохранение списка в локальном хранилище
    //await this.storage.set(name, JSON.stringify(list))

    return list;
  }

  async nextPage(page) {
    this.page = this.page + 1;
    console.log("page", this.page)
    return await this.request();
  }

  async getPage(page = this.page) {
   // this.page = page;
    return this.parse(await this.request(), this.source)
  }

  async findBookByAuthor(bookId, authorId, page = 1) {
    const data = await this.author(authorId, page)
    const filteredData = data.filter(el => el.bid === bookId)[0];
    if(data.length === 20 && filteredData === undefined){
      return await this.findBookByAuthor(bookId, authorId, ++page);
    }else{
      console.log("find by author", filteredData?.title)
      return filteredData;
    }
  }

  storage = {
    get: async (key)=> {
      try{
        return JSON.parse(await AsyncStorage.getItem(key)) || []
      }catch(e){
        console.log("key", key, e)
        return e;
      }

    },
    set: async (key, value)=> {
      try{
        return AsyncStorage.setItem(key, JSON.stringify(value))
      }catch(e){
        console.log(key, value, e)
        return e;
      }
    }
  }
}

export default Collection