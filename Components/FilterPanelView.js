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

  const {filter, changeState} = useBooks();
  const {queryType, filterUpdate} = route.params;

  const PopularPanel = ()=> {



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

    const {newBooksFilter} = filter;
    const {} = route.params;

    useEffect(()=>{

      //if(filterUpdate && filterUpdate.id !== filter.id) {
       // changeState();
       // changeState(1, {...filter, newBooksFilter: filterUpdate})
        /*setFilter({...filter, newBooksFilter: filterUpdate});
        getNextPage(1);*/
      //}

    }, [filterUpdate])

    useEffect(()=>{
      //if(filterUpdate && filterUpdate.id !== filter.id) {
      // changeState();
      // changeState(1, {...filter, newBooksFilter: filterUpdate})
      /*setFilter({...filter, newBooksFilter: filterUpdate});
      getNextPage(1);*/
      //}

    }, [])

    /*useFocusEffect(
      (React.useCallback(() => {
        if(filterUpdate && filterUpdate.id !== filter.id) {
          //setFilter({...filter, newBooksFilter: filterUpdate});
          //getNextPage(1);
        }
      }, []))
    );*/

    return (
      <View style={{...styles.panel, justifyContent: "center"}}>
        <TouchableOpacity onPress={()=>{       changeState()
          /*navigation.navigate("Filter",{queryType})*/}}>
          <View style={{flexDirection: "row"}}>
            <Text style={{color: "#FFF", fontSize:20, paddingRight: 5, textDecorationLine: 'underline',}}>
              {newBooksFilter?.title}</Text>
            <Icon
              name="options"
              backgroundColor={Colors.prime}
              size={30}
              color="#FFF"/>
          </View>
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



const Panel = ({mode, setFilterVisibility})=> {
  const {filter} = useBooks();
  const {newBooksFilter} = filter;

  const  singleModePanel =
    <TouchableOpacity onPress={()=>{setFilterVisibility({panel: false, list: true})}}>
      <View style={{flexDirection: "row"}}>
        <Icon
          name="options"
          backgroundColor={Colors.prime}
          size={30}
          color="#FFF"/>
        <Text style={{color: "#FFF", fontSize:20, paddingLeft: 10, textDecorationLine: 'underline',}}>
          {newBooksFilter?.title}
        </Text>
        <Icon
          backgroundColor={Colors.prime}
          size={30}
          color="#FFF"
          name="close-outline"
          onPress={()=> {setFilterVisibility({panel: false, list: false})}}
          style={{ justifyContent: "flex-end" }}
        />
      </View>
    </TouchableOpacity>

  const multiModePanel = <>
    <CheckBoxUseFilter/>
    <TouchableOpacity  title="OK"   style={{borderWidth:  1, borderColor: "#FFF",
      borderRadius: 5, padding: 7, paddingHorizontal: 15, height: 35}}   color={Colors.prime} >
      <Text>OK</Text>
    </TouchableOpacity>
    <View style={{ justifyContent: "flex-end", justifySelf: "flex-end"}}>
      <Icon.Button
        onPress={()=>{}}
        name="options"
        backgroundColor={Colors.prime}
        size={30}
        color="#FFF"/>
    </View></>

  return (
    <View style={{...styles.panel, justifyContent: "center"}}>
      {mode === "single"?  singleModePanel : multiModePanel}

    </View>


  )
}

export default Panel