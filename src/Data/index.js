import Collection from "./collection";
const proxyCorsUrl ="https://api.allorigins.win/raw?cacheMaxAge=900&url=";
const reserveProxyCorsUrl = "http://gineff.ddns.net:3000/books/proxy/raw?cacheMaxAge=900&url=";
//const reserveProxyCorsUrl ="https://api.allorigins.win/raw?cacheMaxAge=900&url=";
//const proxyCorsUrl = "http://gineff.ddns.net:3000/proxy/raw?cacheMaxAge=900&url=";
//const serverUrl = "localhost:3000/books";
//const serverUrl = "http://gineff-home.ddns.net:3000/books";
const serverUrl = "http://gineff.ddns.net:3000/books";
const proxyImageUrl ="https://images.weserv.nl/?url=";
const cacheMaxAge = 300;
export {proxyCorsUrl,reserveProxyCorsUrl, proxyImageUrl, serverUrl, cacheMaxAge, Collection}