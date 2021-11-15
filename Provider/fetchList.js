
const xmlParser = (text)=> {
  return context.functions.execute("xmlParserFlibusta", text);
}

const htmlParser = async (text)=> {
  const matches = Array.from(text.matchAll(/<a href="\/a\/(.*?)">(.*?)<\/a> - <a href="\/b\/(.*?)">(.*?)<\/a>/g));
  return  matches.map(el=>({
    bid:el[3],
    author:[{name:el[2], id: el[1]}],
    title:el[4],
    sequencesTitle: [],
  }))
};

const getText = async (url)=> {
  const response = await context.http.get({url});
  return response.body.text();
};

const searchBookByAuthor = async (book, searchPage = 1)=> {
  console.log("search in opds by author", searchPage, book.title);
  if(!book.author[0].id) return undefined;
  const text = await getText("http://flibusta.is/opds/author/" + book.author[0].id + "/time"+"/"+(searchPage-1));
  const data = xmlParser(text);
  const filteredData = data.filter(el => el.bid === book.bid)[0];
  if(data.length === 20 && filteredData === undefined){
    return await searchBookByAuthor(book, ++searchPage);
  }else{
    return filteredData;
  }
};

const extendFromOPDS = async (books)=> {
  const collection = context.services.get("mongodb-atlas").db("flibusta").collection("Books");
  const extendedList = [];

  for(let book of books){
    let _book = await collection.findOne({bid: book.bid})
    if(!_book){
      _book = await searchBookByAuthor(book);
      if(_book) collection.insert()

    }

    extendedList.push(_book || book);
  }
  return extendedList;
}

const getList  = async function(listId) {
  listId = "w";
  const text = await getText("http://flibusta.is/stat/"+listId);
  const list = await htmlParser(text);
  const books = await extendFromOPDS(list);
  console.log(books.length);
  console.log("books", JSON.stringify(books[99]));
};



exports = getList;