import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, Button, SectionList ,TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { CommonActions } from '@react-navigation/native';
import  genres from "../Data/genres.js";
import CheckBox from "./CheckBox";
import {Colors} from "../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import {useBooks} from "../Provider/BooksProvider";

const FilterMultiList = ({setFilterIsVisible, refFilter})=> {


  //ref хранение состояния фильра без перерисовки всего дерева при каждом нажатии чекбокс

  const [buttonState, setButtonState] = useState('clearAll');
  //const {filter, setFilter} = useBooks();
  const {popularBooksFilter, useFilter} = refFilter.current;
  const [useFilterLocal, setUseFilterLocal] = useState(useFilter);

  //methods
  const getAll = ()=> genres.reduce((arr,el)=>{arr.push(el.id); el.data.forEach(e=> arr.push(e.id)); return arr;},[]);
  const refFilterLocal = useRef(popularBooksFilter || getAll());

  const getFilterByGroup = (items)=> items.reduce((arr,el)=>{if(refFilterLocal.current.includes(el.id)) arr.push(el.id); return arr},[])

  const clearAll = ()=> {refFilterLocal.current = []; updateFilter();  setButtonState("markAll")}

  const markAll = ()=> {refFilterLocal.current = getAll(); updateFilter(); setButtonState("clearAll")}

  const updateFilter = (id, list)=> {
    if(id) {
      const set = new Set(refFilterLocal.current);
      const group = genres.filter(el=> el.id === id)[0];
      set.delete(id);
      group.data.forEach(el=> set.delete(el.id));
      list.forEach(id=> set.add(id));
      refFilterLocal.current = Array.from(set);
    }

    refFilter.current = {...refFilter.current, popularBooksFilter: refFilterLocal.current, useFilter: useFilterLocal}
    console.log("\x1b[32m", "refFilter change");
    console.log("local", refFilterLocal.current);
    console.log( "main", refFilter.current, "\x1b[0m");
  }

  //Components

  const Item = ({ children, id, style, toggleFilter, groupFilter}) => {
    const checked = groupFilter.includes(id);

    return (
      <CheckBox  onPress={()=>toggleFilter(id)} style={{...style, paddingHorizontal: 5}} checked={checked}>
        <Text style={{alignSelf: "center"}}>{children}</Text>
      </CheckBox>
    )};

  const GroupItem = ({item}) => {

    const [groupFilter, setGroupFilter] = useState([]);
    const [isVisible, setVisible] = useState(false);

    useEffect(()=> {
      const list = getFilterByGroup(item.data);
      if(refFilterLocal.current.includes(item.id)) list.push(item.id);
      setGroupFilter(list);
    }, [])

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

  // Init



  useEffect(()=> {
    //refFilter.current = {...refFilter.current, popularBooksFilter: refFilterLocal.current, useFilter: useFilterLocal}
    //console.log("refFilter change", refFilter.current);
    updateFilter();
  }, [useFilterLocal])



  return  (
    <ScrollView >
      <View style={{backgroundColor: Colors.prime, padding: 5, paddingLeft: 10}}>
        <CheckBox onPress={()=> {setUseFilterLocal(!useFilterLocal) }} style={{color: "#FFF"}} checked={useFilterLocal}>
          <Text style={{alignSelf: "center", color: "#FFF", paddingLeft: 5}}>Использовать фильтр</Text>
        </CheckBox>
      </View>
      <View style={{flexDirection: "row",  padding: 5, paddingLeft: 15}}>
        {buttonState === "clearAll"?
          (<Button color = {Colors.secondary} onPress={clearAll} title="Снять все отметки"/>) :
          (<Button color = {Colors.secondary} onPress={markAll} title="Отметить все" />)}
      </View>
      <View style={{paddingLeft: 10}}>
        {genres.map(el=> <GroupItem key={el.id} item={el}/>  )}
      </View>
    </ScrollView>
  );
}




const FilterSimpleList = ({setFilterIsVisible, refFilter})=> {
  //const {filter} = useBooks();
  //const {newBooksFilter} = filter;
  const {newBooksFilter} = refFilter.current;


  const handleSelect = (item)=> {
    //setFilter({...filter, newBooksFilter: item})
    refFilter.current = ({...refFilter.current, newBooksFilter: item})
    setFilterIsVisible(false);
  }

  const SimpleItem = ({title, id, style})=> {
    return (
      <TouchableOpacity onPress={()=> {handleSelect({id, title})}} >
        <View style={{...style, paddingVertical: 5, flexDirection: "row"}}>
          {id>=0 && <Icon style={{alignSelf: "center"}} name="radio-button-off"/>}
          <Text style={{fontSize: 18, paddingLeft: 5, color: (id > 0? "#000" : Colors.prime)}}>{title}</Text>
        </View>
      </TouchableOpacity>)
  }

  const GroupItem = ({item})=> {
    const [isVisible, setVisible] = useState(false);
    return (
      <View>
        <View style={{flexDirection: "row"}}>
          <SimpleItem  id={item.id} key={item.id}/>
          <TouchableOpacity onPress={()=>{ setVisible(!isVisible)}}>
            <View  style={{alignItems:"center", paddingLeft: 5, flexDirection: "row"}}>
              <Text style={{ paddingRight: 5, fontSize:16}}>{item.title}</Text>
              {isVisible?
                (<Icon  name= "chevron-up-outline"  size={20} color="#000" />) :
                (<Icon  name= "chevron-down-outline"  size={20} color="#000" />)}
            </View>
          </TouchableOpacity>
        </View>
        {isVisible && item.data.map(el=> <SimpleItem  style={{paddingLeft: 25}} id={el.id} key={el.id} title={el.title}/>)}
      </View>
  )}

  return (
    <View style={{ paddingHorizontal: 5 }}>
      <ScrollView style={{ paddingHorizontal: 5}}>
        <View style={{flexWrap: "wrap", margin: 10}}>
          {(<Icon.Button
            name={newBooksFilter.id === 0? "checkmark-outline" : "close-outline"}
            backgroundColor= {Colors.secondary}
            onPress={()=> {handleSelect({title: "Все жанры", id: 0})}}
            style={{ paddingRight: 15 }}
          >
            {newBooksFilter.title}
          </Icon.Button>)}
        </View>
        {genres.map(el=> <GroupItem key={el.id} item={el}/>  )}
      </ScrollView>
    </View>

   )
}

export default (props) => {

  const { route, setFilterIsVisible, refFilter} = props;
  const {queryType} = route.params;
  const {filter} = useBooks();
  refFilter.current = filter;

  return queryType === "newForWeek"?
    <FilterSimpleList setFilterIsVisible={setFilterIsVisible} refFilter={refFilter}/> :
    <FilterMultiList setFilterIsVisible={setFilterIsVisible} refFilter={refFilter}/>
}


export {FilterMultiList, FilterSimpleList}

