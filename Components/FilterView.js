import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import  genres from "../Data/genres.js";
import CheckBox from "./CheckBox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Ionicons";

export default  ({navigation, isModalVisible, setModalVisible})=> {

  const filter = useRef([]);
  const [commonFilter, setCommonFilter] = useState([]);

  


  useEffect(()=> {
    AsyncStorage.getItem("GENRES_FILTER", (err, item)=> {
      filter.current = item ? JSON.parse(item) : [];
      setCommonFilter(filter.current);
    })
  },[])

  const Item = ({ children, id, style, toggleFilter, groupFilter}) => {

    const checked = groupFilter.includes(id);

    return (
      <TouchableWithoutFeedback onPress={()=>toggleFilter(id)}>
        <View style={{...style, flexDirection: "row"}} >
          <CheckBox id={id} style={{paddingHorizontal: 5}} checked={checked}/>
          <Text style={{alignSelf: "center"}}>{children}</Text>
        </View>
      </TouchableWithoutFeedback>

    )};

  const GroupItem = ({item}) => {

    const [groupFilter, setGroupFilter] = useState([]);
    const [isVisible, setVisible] = useState(false);

    useEffect(()=> {
      const list  = item.data.reduce((arr, el)=>{ if(commonFilter.includes(el.id)) arr.push(el.id); return arr },[]);
      setGroupFilter(list);
    }, [commonFilter])

    const toggleFilter = (id)=> {

      const set = new Set(groupFilter);

      if(set.has(id)){
        if(id<0) {
          set.clear();
        }else{
          set.delete(item.id); set.delete(id)
        }
      }else{
        if(id<0){
          item.data.forEach(el=> set.add(el.id));
          set.add(item.id);
        }else{
          set.add(id);
          if(item.data.length === set.size) set.add(item.id)
        }
      }
      setGroupFilter(Array.from(set));
    }

    return (
      <View>
        <View style={{flexDirection: "row"}}>
          <Item groupFilter={groupFilter} toggleFilter={toggleFilter} id={item.id} key={item.id}/>
          <TouchableOpacity onPress={()=>{ setVisible(!isVisible)}}>
            <View  style={{alignItems:"center", paddingLeft: 5, flexDirection: "row"}}>
              <Text style={{ paddingRight: 5, fontSize:16}}>{item.title}</Text>
              {isVisible?
                (<Icon  name= "chevron-up-outline"  size={20} color="#000" />) :
                (<Icon  name= "chevron-down-outline"  size={20} color="#000" />)}
            </View>
          </TouchableOpacity>
        </View>
        {isVisible && item.data.map(el=> <Item groupFilter={groupFilter} toggleFilter={toggleFilter} style={{paddingLeft: 25}} id={el.id} key={el.id}>{el.title}</Item>)}
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

