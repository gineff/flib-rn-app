import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, Button, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import  genres from "../Data/genres.js";
import CheckBox from "./CheckBox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Ionicons";

export default  ({navigation})=> {

  const filter = useRef([]);
  const [commonFilter, setCommonFilter] = useState([]);
  const [buttonState, setButtonState] = useState('clearAll');


  useEffect(()=> {
    AsyncStorage.getItem("GENRES_FILTER1", (err, item)=> {
      filter.current = item ? JSON.parse(item) :
        genres.reduce((arr,el)=>{arr.push(el.id); el.data.forEach(e=> arr.push(e.id)); return arr;},[]);
      setCommonFilter(filter.current);
    })
  },[])

  const clearAll = ()=> {setCommonFilter([]); filter.current = []; setButtonState("markAll")}

  const markAll = ()=>{
    filter.current = genres.reduce((arr,el)=>{
      arr.push(el.id); el.data.forEach(e=>
        arr.push(e.id)); return arr;},[]);
    console.log(filter.current)
    setCommonFilter(filter.current);
    setButtonState("clearAll")
  }

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
      if(commonFilter.includes(item.id)) list.push(item.id)
      setGroupFilter(list);
    }, [commonFilter])

    useEffect(()=>{

    }, [groupFilter])

    const toggleFilter = (id)=> {

      const set = new Set(groupFilter);

      if(set.has(id)){
        if(id<0) {
          //убрать все
          set.clear();
        }else{
          //убрать пункт и группу
          set.delete(item.id); set.delete(id)
        }
      }else{
        if(id<0){
          //отметить все в т.ч. группу
          item.data.forEach(el=> set.add(el.id));
          set.add(item.id);
        }else{
          //отметить пункт и группу если все пункты отмечены
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

      {buttonState === "clearAll"? (<Button onPress={clearAll} title="Снять все отметки"/>) :
        (<Button onPress={markAll} title="Отметить все" />)}
      <Text>Жанр</Text>
      {genres.map(el=>{
        return <GroupItem key={el.id} item={el}/>
      } )}
    </ScrollView>
  );
}

