import React, { useState, useEffect, useRef } from "react";
import { Button, Text, View, SectionList } from "react-native";
import Modal from "react-native-modal";
import CheckBox from '@react-native-community/checkbox';
import  genres from "../Data/genres.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default  ({navigation, isModalVisible, setModalVisible})=> {

  const runFilterCounter  = useRef(0);
  const [genresList, setGenres] = useState([]);
  const filter = useRef([]);

  console.log("filter render", runFilterCounter.current )
  runFilterCounter.current = runFilterCounter.current + 1;

  useEffect(()=> {
    AsyncStorage.getItem("GENRES_FILTER", (err, item)=> {
      filter.current = item ? JSON.parse(item) : [];
    })
  },[])


  const Item = ({ children, id, style, checked}) => (
    <View style={{...style, flexDirection: "row"}}>
      <GenreCheckBox id={id}  checked={checked}/>
      <Text style={{alignSelf: "center"}}>{children}</Text>
    </View>
  );

  const GenreCheckBox = ({id, checked})=> {

    const [toggleCheckBox, setToggleCheckBox] = useState(checked);

    const onCheckBoxChange = (newValue) => {
      setToggleCheckBox(newValue);

      const set = new Set(filter.current);
      if(newValue){
        set.add(id);
      }else{
        set.delete(id)
      }
      filter.current = (Array.from(set))
    }

    return (<CheckBox
    disabled={false}
    value={toggleCheckBox}
    onValueChange={onCheckBoxChange}
    />)
  }


  return (
    <View style={{ flex: 1 }}>

      <Modal isVisible={isModalVisible} style={{backgroundColor: "#FFF"}}>
        <View style={{ flex: 1 }}>
          <Button title="Hide modal" onPress={toggleModal} />
          <Text>Жанр</Text>

          <SectionList
            sections={genresList}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item, section }) =>
              <Item style={{paddingLeft:30}} checked={item.checked} id={item.id}>{item.title}</Item>}
            renderSectionHeader={({ section: { title, id } }) => (
              <Item id={id} >{title}</Item>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

