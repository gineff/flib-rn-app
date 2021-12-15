import {xmlParser, fb2Parser, htmlParser} from "../service";
import AsyncStorage from "@react-native-async-storage/async-storage";
const proxyCorsUrl = "https://api.allorigins.win/raw?cacheMaxAge=900&url=";
const opdsCatalog = "http://flibusta.is/opds";
const serverUrl = "http://gineff.ddns.net:3000/books";

//const cache = new Map();

const request = async (url, options) => {
//  if(cache.has(url)) return cache.get(url)
  const res = await fetch(proxyCorsUrl+encodeURI(url), options);
  if(res.status !== 200) return new Error("server error");
  return options?  await res.json() :  await res.text();

}

//когда обнуляется page?


const Collection = class {
  constructor(options) {
    this.page = 1;
    Object.assign(this, options);
  }
  async request (options = {}) {
    console.log("request",this)
    const {queryType = this.queryType, queryId = this.queryId, page = this.page} = options;
    switch (queryType) {
      case "author":
        return await request(`${opdsCatalog}/author/${queryId}/time/${(page-1)}`);
      case "sequence":
        return await request(`${opdsCatalog}/sequencebooks/${queryId}/${page-1}`);
      case "newForWeek":
        return await request(`${opdsCatalog}/new/${page-1}/new`);
      case "genre":
        return await request(`${opdsCatalog}/opds/new/${page-1}/newgenres/${queryId}`);
      case "genres":
        return await request(`${opdsCatalog}/opds/newgenres/`);
      case "listFromServer":
        return await fetch(`${serverUrl}/list/${queryId}`,options).then(res=>res.json());
      case "listFromSite":
        return await request(`${opdsCatalog}/stat/${queryId}`);
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

  async newForWeek(page = 1) {
    this.page = page;
    this.queryType = "newForWeek";
    return this.parse(await this.request(),"opds");
  }

  async list(id, options) {

    this.queryType = "list";
    this.queryId = id;
    const {savedList} = options;
    let listFromSite = [];

    //1.
    //получаем список id с сервера
    const newBooksID = await fetch(`${serverUrl}/list/${id}`).then(res=> res.json()) ||

    //или получаем данные с сайта
      await (async ()=> {
        const text = await this.request({queryType: "listFromSite", queryId: this.queryId}) || "";
        listFromSite = this.parse(text,"html-popularList") || [];
        return listFromSite.reduce((arr,el)=>{if(el?.bid){arr.push(el.bid)} return arr},[])
      })()

    //2.
    //получаем список id из локального хранилища
    const listOfBooksId = savedList.map(el=>el.bid);

    //3.
    //сравнение и подготовка списка id недостающих книг
    const ListOfMissingBooksId = newBooksID.filter(id=> !listOfBooksId.includes(id));

    //4.
    // запрос недостающих книг с сервера
    const newBooks = await fetch(serverUrl, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body:  JSON.stringify(ListOfMissingBooksId)
    }).then(res=> res.json()) ||

    //или запрос недостающих книг с сайта
      await (async ()=>{
        const books = [];
        for(let id of ListOfMissingBooksId){
          const book = listFromSite.filter(el=>el.bid === id)[0];
          const foundBook = await this.findBookByAuthor(book);
          if(foundBook) books.push(foundBook);
        }
        return books;
    })()

    //5.
    //объединяем списки используя Map
    const map = new Map();
    savedList.forEach(el=> map.set(el.bid, el))
    newBooks.forEach(el=> map.set(el.bid, el))

    //6.
    //создаем список книг
    //на флибусте бывает так, что в популярных списках у книги один id, а в книгах у автора другой.
    //это происходит из-за того, что книгу обновили, а в списках осталась прежняя версия
    const list = newBooksID.reduce((arr, id)=> {if(map.has(id)) {arr.push( map.get(id))} return arr},[])

    //7.
    //сохранение списка в локальном хранилище
    //await this.storage.set(id, JSON.stringify(list))

    return list;
  }

  async nextPage(page) {
    this.page = this.page + 1;
    return await this.request();
  }

  async getPage(page) {
    this.page = page;
    return this.parse(await this.request(), this.source)
  }

  async findBookByAuthor(bookId, authorId, page = 1) {
    const data = this.author(authorId, page)
    const filteredData = data.filter(el => el.bid === bookId)[0];
    if(data.length === 20 && filteredData === undefined){
      return await this.findBookByAuthor(bookId, authorId, ++page);
    }else{
      return filteredData;
    }
  }

  storage = {
    get: async (key)=> {
      return JSON.parse(await AsyncStorage.getItem(key)) || []
    },
    set: async (key, value)=> {
      return AsyncStorage.setItem(key, JSON.stringify(value))
    }
  }
}

export default Collection