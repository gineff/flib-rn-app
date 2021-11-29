import {proxyCorsUrl, cacheMaxAge} from "../Data";
import {xmlParser, htmlParser, commentParser} from "./flibustaParser"

const getText = async (url)=> {
  return fetch(proxyCorsUrl+encodeURIComponent('http://flibusta.is'+url), {cache: "no-store"}) .then(response=>response.text())
};

const cutString = (str, length = 35)=> {
  return (str && str.length>length)? str.slice(0,length)+"..." : str;
}

export {getText, cutString, xmlParser, htmlParser, commentParser}