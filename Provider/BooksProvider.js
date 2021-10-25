import React, { useContext, useState, useEffect, useRef } from "react";

import matchAll from "string.prototype.matchall";
import xmlParserFlibusta from "../service/xmlParserFlibusta";
const proxyCorsUrl ="https://api.allorigins.win/raw?url=";
const BooksContext = React.createContext(null);
const [books, setBooks] = useState([]);
const [page, setPage] = useState(1);

const getText = async (url)=> {
  return fetch(proxyCorsUrl+encodeURIComponent('http://flibusta.is'+url))
    .then(response=>response.text())
};

const BooksProvider = ({children, queryType, query})=> {

  const requestToFlibusta = async ()=> {
    const text = await getText(url);
    const data = await xmlParserFlibusta(text) ;
    setBooks(data);
  }

  useEffect(()=> {
    requestToFlibusta()

  }, [])

  const moreBooks = ()=> {
    setBooks(books);
  }

  return (
    <BooksContext.Provider
      value={{
        books,
        moreBooks
      }}
    >
      {children}
    </BooksContext.Provider>
  );
}

const useBooks = () => {
  const task = useContext(BooksContext);
  if (books == null) {
    throw new Error("useBooks() called outside of a BooksProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return task;
};

export { BooksProvider, useBooks };