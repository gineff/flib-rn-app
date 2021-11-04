import  React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "./CheckBox";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {Colors} from "../Styles";
import Icon from "react-native-vector-icons/Ionicons";

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



const PopularPanel = ()=> {
  return (<View style={styles.panel}>
    <CheckBoxUseFilter/>
    <TouchableOpacity  title="OK"   style={{borderWidth:  1, borderColor: "#FFF",
      borderRadius: 5, padding: 7, paddingHorizontal: 15, height: 35}}   color={Colors.prime} >
      <Text>OK</Text>
    </TouchableOpacity>
    <View style={{ justifyContent: "flex-end", justifySelf: "flex-end"}}>
      <Icon.Button
        onPress={()=>navigation.navigate("Filter")}
        name="options"
        backgroundColor={Colors.prime}
        size={30}
        color="#FFF"/>
    </View>
  </View>)
}

const NewPanel = ()=> {

  const [filter, setFilter] = useState({id:0, title: "Все жанры"})

  useEffect(()=> {
    AsyncStorage.getItem("NEW_BOOK_FILTER", (err, res)=> {
      if(res) setFilter(JSON.parse(res));
    })
  }, [])

  return (
    <View style={{...styles.panel, justifyContent: "center"}}>
      <TouchableOpacity onPress={()=>{}}>
        <View style={{flexDirection: "row"}}>
          <Text style={{color: "#FFF", fontSize:20, paddingRight: 5, textDecorationLine: 'underline',}}>{filter.title}</Text>
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

const FilterPanel = ({navigation, queryType})=> {
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