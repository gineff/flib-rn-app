import {proxyCorsUrl, reserveProxyCorsUrl, serverUrl} from "../Data";
import {xmlParser, htmlParser, commentParser, fb2Parser} from "./flibustaParser"

const getText = async (url)=> {
    const response =  await fetch(proxyCorsUrl+encodeURIComponent('http://flibusta.is'+url), {cache: "no-store"})
    if(response.status === 200) return await response.text();
    const res = await fetch(reserveProxyCorsUrl+encodeURIComponent('http://flibusta.is'+url), {cache: "no-store"})
    return await res.text();
};

const cutString = (str, length = 35)=> {
  return (str && str.length>length)? str.slice(0,length)+"..." : str;
}

export {getText, cutString, xmlParser, htmlParser, commentParser, fb2Parser}