import genres from "../../Data/genres";
import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "../../Styles"
import { NavigationContext } from '@react-navigation/native';

const findGenreByTitle = (title)=> {
  let genre;
  genres.every(el=> {
    return el.data.every(e=> {
      if(e.title === title){
        genre = e;
        return false;
      }else{
        return true;
      }
    })
  })
  return genre;
}

const Genres = ({children, onGenreClick})=> {
  const navigation = React.useContext(NavigationContext);

  //компонет украчивает длинные названия жанров, для этого используется ограничение - не более 2х жанров на строку
  //жанры которые попадают по это ограничение переносят строки,
  //а так как введено огранчение на 1 строку (numberOfLines={1}), они укорачиваются.
  const genres = children;
  const [maxWidth, setMaxWidth] = useState("48%");
  const [lines, setLines] = useState(1);

  const handleGenrePress = (genre)=> {
    if(maxWidth === "48%" && lines> 1){
      //раскрываем жанр на всю строку.
      setMaxWidth("96%");
    }else{
      const _genre = findGenreByTitle(genre);
      onGenreClick(_genre);
      //navigation.navigate("BooksList",{query: _genre.id, queryType: "genre", source: "opds"})
    }
  }

  const onTextLayout = e => {
    setLines(e.nativeEvent.lines.length)
  };

  return (<>
    {genres?.map((genre, i)=>(
      <TouchableOpacity style={{maxWidth: maxWidth}} key={i} onPress={()=>handleGenrePress(genre)}  >
        <View style={styles.bookGenreWrapper}>
          <Text onTextLayout={onTextLayout} numberOfLines={1} style={styles.bookGenre}>{genre}</Text>
        </View>
      </TouchableOpacity>
    ))
    }
  </>)

};

const styles = StyleSheet.create({
  bookGenreWrapper: {
    marginLeft:5,
    marginBottom: 3
  },
  bookGenre: {
    color: "#FFF",
    borderRadius:5,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 5
  },
})

export default Genres;