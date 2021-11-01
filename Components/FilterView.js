import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import  genres from "../Data/genres.js";
import CheckBox from "./CheckBox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Ionicons";

export default  ({navigation, isModalVisible, setModalVisible})=> {

  const filter = useRef([]);
  const [genreFilter, setGenreFilter] = useState([]);

  useEffect(()=> {
    AsyncStorage.getItem("GENRES_FILTER", (err, item)=> {
      filter.current = item ? JSON.parse(item) : [];
      setGenreFilter(filter.current);
    })
  },[])



  const GroupItem = ({item}) => {

    const [groupFilter, setGroupFilter] = useState(item.data);
    const [isVisible, setVisible] = useState(false);

    const Item = ({ children, id, style}) => {

      const  [checked, setChecked] = useState(false);

      useEffect(()=> {
        setChecked(genreFilter.includes(id))
      }, [genreFilter])

      const onToggleCheckbox = ()=> {
        const set = new Set(filter.current);
        if(checked) {
          set.delete(id);
        }else{
          set.add(id);
        }
        filter.current = Array.from(set);
        setChecked(!checked);
        console.log(filter.current);
      }

      return (
        <TouchableWithoutFeedback onPress={onToggleCheckbox}>
          <View style={{...style, flexDirection: "row"}} >
            <CheckBox id={id} style={{paddingHorizontal: 5}} checked={checked}/>
            <Text style={{alignSelf: "center"}}>{children}</Text>
          </View>
        </TouchableWithoutFeedback>

      )};


    return (
      <View>
        <View style={{flexDirection: "row"}}>
          <Item id={item.id} key={item.id}/>
          <TouchableOpacity onPress={()=>{ setVisible(!isVisible)}}>
            <View  style={{alignItems:"center", paddingLeft: 5, flexDirection: "row"}}>
              <Text style={{ paddingRight: 5, fontSize:16}}>{item.title}</Text>
              {isVisible?
                (<Icon  name= "chevron-up-outline"  size={20} color="#000" />) :
                (<Icon  name= "chevron-down-outline"  size={20} color="#000" />)}
            </View>
          </TouchableOpacity>
        </View>
        {isVisible && item.data.map(el=> <Item style={{paddingLeft: 25}} id={el.id} key={el.id}>{el.title}</Item>)}
      </View>

    )}


  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 5 }}>
      <Text>Жанр</Text>
      {genres.map(el=>{
        return <GroupItem key={el.id} item={el}/>
      } )}
    </ScrollView>
  );
}

