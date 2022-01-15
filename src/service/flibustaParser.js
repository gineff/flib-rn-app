import matchAll from 'string.prototype.matchall';

const nameIsSection = (node)=> {
  return node.nodeName === "section";
}

const hasChildSection = (node) => {
  let hasChildSection = false;
  for(let i=0; i< node.childNodes.length; i++) {
    if(node.childNodes.item(i).nodeName === "section"){
      hasChildSection = true; break
    }
  }
  return hasChildSection;
}

const parseNodeOLd =  (parent)=> {
  let jsdom;

  if(nameIsSection(parent)){
    jsdom = []
  }else{
    jsdom = {}
  }

  if(nameIsSection(parent)){
    parent.children.forEach(el=> {
      if(nameIsSection(parent)){
        
      }else{
        //обычный парсинг
      }
    })
  }else{
    //обычный парсинг
  }

  const attr = parent.attributes;
  for(let i =  0; i < attr.length; i++) {
    jsdom[attr[i].name] = attr[i].value;
  }

  for (let i = 0; i < parent.childNodes.length; i++) {
    let child = parent.childNodes.item(i);

    if(child.nodeType === 3 && parent.childNodes.length ===1 ){
      jsdom = attr.length? {...jsdom, text: child.nodeValue} : child.nodeValue;
    }else if(child.nodeType === 1) {

      const children = parseNode(child);

      if(children){
        let element = jsdom[child.nodeName];
        if(element) {
          element = Array.isArray(element)? element : [element];
          jsdom[child.nodeName] = [...element, children];
        }else{
          jsdom[child.nodeName] = children;
        }
      }
    }
  }




  return jsdom;
}

const parseNode =  (parent, options= {})=> {

  const {nonGroupNames} = options;
  let items = [];
  for (let i = 0; i < parent.childNodes.length; i++) {
    let child = parent.childNodes.item(i);
    if(child.nodeType === 3 && child.nodeValue.trim()){
      items.push(child.nodeValue);
    }else if(child.nodeType === 1) {
      items.push(parseNode(child, options));
    }
  }

  const attr = parent.attributes;
  const hasAttributes = !!(attr && attr.length);
  const attributes = {};
  if(attr) {
    for(let i =  0; i < attr.length; i++) {
      attributes[attr[i].name] = attr[i].value;
    }
  }

  if(items.length <= 1){
    let item = {};
    item = (hasAttributes && typeof  items[0] === 'string')? {text: items[0]} : items[0];
    item = hasAttributes?  {...attributes, ...item} : item;
    return {[parent.nodeName]: item};
  }else{
    items = nonGroupNames?.includes(parent.nodeName)?
      items :
      items.reduce((item, el)=>{
        const key = Object.keys(el)[0];
        item[key] = item[key] || [];
        item[key].push(el[key]);
        return item
      } ,{})

    items = Array.isArray(items)?
      items :
      Object.keys(items).reduce((item, key)=>{
        item[key] = items[key].length === 1?
          items[key][0] :
          items[key];
        return item;
      },{})
    return {[parent.nodeName]: items};
  }
}


const fb2Parser = (xml)=> {
  if(typeof xml === "string") {
    const { DOMParser } = require('xmldom')
    xml = new DOMParser().parseFromString(xml, "application/xml");

    return parseNode(xml, {nonGroupNames: "section"})
  }
}

const xmlParser = function(xml) {

  if(typeof xml === "string") {
    const { DOMParser } = require('xmldom')
    xml = new DOMParser().parseFromString(xml, "application/xml");
  }

  const books = [];
  const feed = xml.childNodes.item(0).nodeName === "feed"? xml.childNodes.item(0):
    xml.childNodes.item(2);

  for (let i = 0; i < feed.childNodes.length; i++) {
    let item = feed.childNodes.item(i);
    if(item.nodeName === 'entry') {
      let book = {author:[], genre: [], sequencesId: [], downloads: []};
      for (let ii = 0; ii < item.childNodes.length; ii++) {
        let el = item.childNodes.item(ii);
        if(el.nodeName === 'title') {
          book.title = el.textContent;
        }else if(el.nodeName === "dc:issued"){
          book.year = el.textContent;
        }else if(el.nodeName === 'content') {
          book.content = el.textContent;
          let res =  Array.from( matchAll(book.content, /Серия: (.*?)<br\/>/g));
          book.sequencesTitle = res.map(el=>el[1]);
        }else if(el.nodeName === 'author') {
          let author = {};
          author.name = el.childNodes.item(1).textContent;
          author.id = el.childNodes.item(3).textContent.split('/')[2];
          book.author.push(author);
        }else if(el.nodeName === 'category') {
          book.genre.push(el.getAttribute('term'));
        }else if(el.nodeName === 'link') {
          let type = el.getAttribute('type');
          let href = el.getAttribute('href');
          let rel = el.getAttribute('rel');

          if (type === "image/jpeg" && !book.image) {
            book.image =  href;
          } else if (href && /sequencebooks/.test(href) )
            book.sequencesId.push(href.split("/").pop());
          else if (rel === "http://opds-spec.org/acquisition/open-access") {
            book.downloads.push({href: href, type});
          }else if(rel === 'alternate'){
            book.bid = href.split("/").pop();
          }else if(type === "application/atom+xml;profile=opds-catalog") {
            book.genreId = href.split("/").pop();
          }
        }

      }
      books.push(book);
    }
  }

  return books;
};

const htmlParser = (text)=> {
  const matches = Array.from(matchAll(text,/<a href="\/a\/(.*?)">(.*?)<\/a> - <a href="\/b\/(.*?)">(.*?)<\/a>/g));
  return  matches.map(el=>({
    bid:el[3],
    author:[{name:el[2], id: el[1]}],
    title:el[4],
    sequencesTitle: [],
    //простой вид (нет контента и других важных реквизитов)
    simple: true
  }))
};

const commentParser = async (text)=> {
  const matchesComments = Array.from(matchAll(text,/<span class="container_.*?>(.*?)<\/span>/gus));
  const comments = matchesComments.map(el=>{
    const html = el[1];
    const matchAuthor = Array.from(matchAll(html,/<b><a href=.*?>(.*?)<\/a><\/b>/gm));
    const matchDate = Array.from(matchAll(html,/(\d{2}:\d{2} \(.*?\) \/ \d{2}-\d{2}-\d{4})/gm));
    const matchMark =  Array.from(matchAll(html,/Оценка: (.*?)</gm));
    const matchText =  (Array.from(matchAll(html,/br>((.|\n)*)<div/gm)));
    const result =  {
      author: matchAuthor[0] && matchAuthor[0][1],
      date: matchDate[0] && matchDate[0][1],
      mark: matchMark[0] && matchMark[0][1],
      text: matchText[0] && matchText[0][1].replace(/<br>/g,"\n")};
    return result;
  })
  const matchesRecommendation = Array.from(matchAll(text,/bdata=id\">(\d+) пользователей<\/a>/g));
  const recommendation = matchesRecommendation[0] && matchesRecommendation[0][1];
  const matchesMarks =  Array.from(matchAll(text,/<p>Оценки: (\d+),.*?(\d\.*\d*)<\/p>/g));
  const marks = matchesMarks[0] && [matchesMarks[0][1], matchesMarks[0][2]]
  return  [recommendation, comments, marks]

};




export {xmlParser, htmlParser, commentParser, fb2Parser};