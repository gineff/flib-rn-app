import matchAll from 'string.prototype.matchall';

const xmlParser = function(xml) {

  if(typeof xml === "string") {
    const { DOMParser } = require('xmldom')
    xml = new DOMParser().parseFromString(xml, "application/xml");
  }

  const books = [];
  const feed = xml.childNodes.item(0).nodeName === "feed"? xml.childNodes.item(0): xml.childNodes.item(2);

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
          }
        }

      }
      books.push(book);
    }
  }

  return books;
};

const htmlParser = async (text)=> {
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
  return  [matchesRecommendation[0] && matchesRecommendation[0][1],comments]
};




export {xmlParser, htmlParser, commentParser};