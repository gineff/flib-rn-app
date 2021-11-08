import  React, {useEffect, useState, useMemo} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "./CheckBox";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {Colors} from "../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import {useFocusEffect} from "@react-navigation/native";
import {useBooks} from "../Provider/BooksProvider";



//два вида пнели фильтра
//популярные книги и новые книги
const CheckBoxUseFilter = ()=> {
  const [useFilter, setUseFilter] = useState(false)

  useEffect(()=> {
    AsyncStorage.getItem("USE_FILTER", (err, res)=> {
      setUseFilter(res === null && true || JSON.parse(res))
    })
  },[])

  const toggleUseFiler = ()=> {
    AsyncStorage.setItem("USE_FILTER", JSON.stringify(!useFilter))
    setUseFilter(!useFilter)
  }

  return (
    <CheckBox style={{color:"#FFF"}} onPress={toggleUseFiler} checked={useFilter}>
      <Text style={{color:"#FFF", paddingLeft: 5, fontSize: 18, alignSelf :"center"}}>Использовать фильр </Text>
    </CheckBox>)
}

const FilterPanel = ({navigation, route})=> {

  const {filter, setFilter} = useBooks();
  const {queryType, filterUpdate} = route.params;

  console.log("route", route);

  const PopularPanel = ()=> {

    const [filter, setFilter] = useState({id:0, title: "Все жанры"})

    useEffect(()=> {
      console.log("filter set")
    }, [filter])


    useFocusEffect(
      React.useCallback(() => {
        AsyncStorage.getItem("NEW_BOOK_FILTER", (err, res)=> {
          if(res) setFilter(JSON.parse(res));
        })
      }, [])
    );

    return (<View style={styles.panel}>
      <CheckBoxUseFilter/>
      <TouchableOpacity  title="OK"   style={{borderWidth:  1, borderColor: "#FFF",
        borderRadius: 5, padding: 7, paddingHorizontal: 15, height: 35}}   color={Colors.prime} >
        <Text>OK</Text>
      </TouchableOpacity>
      <View style={{ justifyContent: "flex-end", justifySelf: "flex-end"}}>
        <Icon.Button
          onPress={()=>navigation.navigate("Filter", {queryType})}
          name="options"
          backgroundColor={Colors.prime}
          size={30}
          color="#FFF"/>
      </View>
    </View>)
  }

  const NewPanel = ()=> {
    //в случае если нужно сохранять фильтр
    //const [newBookFilter, setNewBookFilter] = useState(filter.newBookFilter)
    //const [newBookFilter, setNewBookFilter] = useState({title: "Все жанры"})
    const refGenre = React.useRef({title: "Все жанры"})
    const genre = refGenre.current;

    useFocusEffect(
      (React.useCallback(() => {
        //setPage(1);
        //setGenre(filterUpdate);
        //if(filterUpdate) genre.current = filterUpdate;
        //moreBooks(1);
        //if(filterUpdate) setFilter(filterUpdate);
      }, []))
    );

    return (
      <View style={{...styles.panel, justifyContent: "center"}}>
        <TouchableOpacity onPress={()=>navigation.navigate("Filter",{queryType})}>
          <View style={{flexDirection: "row"}}>
            <Text style={{color: "#FFF", fontSize:20, paddingRight: 5, textDecorationLine: 'underline',}}>{genre?.title}</Text>
            <Icon
              name="options"
              backgroundColor={Colors.prime}
              size={30}
              color="#FFF"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity  title="OK"   style={{borderWidth:  1, borderColor: "#FFF", marginLeft: 25,
          borderRadius: 5, padding: 7, paddingHorizontal: 15, height: 35}}   color={Colors.prime} >
          <Text style={{color: "#FFF"}}>OK</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View >
      {queryType === "newForWeek"? (<NewPanel/>) : (<PopularPanel/>)}
    </View>
  )
}

const styles = StyleSheet.create({
  panel: {
    height: 50,
    backgroundColor: Colors.prime,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15}
})
export default FilterPanel