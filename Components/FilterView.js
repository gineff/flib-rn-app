import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, Button, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import  genres from "../Data/genres.js";
import CheckBox from "./CheckBox";
import {Colors} from "../Styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Ionicons";

export default  ({navigation})=> {

  //ref хранение состояния фильра без перерисовки всего дерева при каждом нажатии чекбокс
  const filter = useRef([]);
  const [buttonState, setButtonState] = useState('clearAll');
  const [update, setUpdate] = useState(false);


  useEffect(()=> {
    AsyncStorage.getItem("GENRES_FILTER", (err, item)=> {
      filter.current = item ? JSON.parse(item) : getAll();
      setUpdate(true);
    })
  },[])

  //methods

  const getAll = ()=> genres.reduce((arr,el)=>{arr.push(el.id); el.data.forEach(e=> arr.push(e.id)); return arr;},[]);

  const getByGroup = (items)=> items.reduce((arr,el)=>{if(filter.current.includes(el.id)) arr.push(el.id); return arr},[])

  const clearAll = ()=> {filter.current = []; updateFilter(); setButtonState("markAll")}

  const markAll = ()=> {filter.current = getAll(); updateFilter(); setButtonState("clearAll")}

  const updateFilter = (id, list)=> {
    if(id) {
      console.log("filter 1", filter.current)
      const set = new Set(filter.current);
      const group = genres.filter(el=> el.id === id)[0];
      set.delete(id);
      group.data.forEach(el=> set.delete(el.id));
      console.log("filter 2", Array.from(set))
      list.forEach(id=> set.add(id));
      filter.current = Array.from(set);
      console.log("filter 3", filter.current)
    }
    AsyncStorage.setItem("GENRES_FILTER", JSON.stringify(filter.current))
  }

  //Components

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
      if(update) {
        const list = getByGroup(item.data);
        if(filter.current.includes(item.id)) list.push(item.id);
        setGroupFilter(list);
      }
    }, [update])



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
      const list = Array.from(set);
      updateFilter(item.id, list)
      setGroupFilter(list);
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

  //Render

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 5 }}>
      {buttonState === "clearAll"? (<Button style={{width: 40, backgroundColor: Colors.prime}} onPress={clearAll} title="Снять все отметки"/>) :
        (<Button style={{width: "80%"}} onPress={markAll} title="Отметить все" />)}
      <Text>Жанр</Text>
      {genres.map(el=> <GroupItem key={el.id} item={el}/>  )}
    </ScrollView>
  );
}

