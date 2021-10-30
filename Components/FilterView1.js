import React, { useState, useEffect, useRef } from "react";
import { Button, Text, View, SectionList } from "react-native";
import Modal from "react-native-modal";
import CheckBox from '@react-native-community/checkbox';
import  genres from "../Data/genres.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default  ({navigation, isModalVisible, setModalVisible})=> {

  const runFilterCounter  = useRef(0);
  const [genresFilterList, setGenresFilter] = useState([]);
  const [genresList, setGenres] = useState([]);

  console.log("filter render", runFilterCounter.current )
  runFilterCounter.current = runFilterCounter.current + 1;

  useEffect(()=> {
    AsyncStorage.getItem("GENRES_FILTER", (err, item)=> {
      if(item) setGenresFilter(JSON.parse(item));
    })
  },[])

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const MemoCheckBox = React.memo(GenreCheckBox,()=>{})

  const GenreCheckBox = ({id, checked})=> {

    const runCounter = useRef(checked);
    const [toggleCheckBox, setToggleCheckBox] = useState(checked);

    const onCheckBoxChange = () => {
      //setToggleCheckBox(newValue);
      // runCounter.current = newValue;
      const set = new Set(genresFilterList);
      if(!checked){
        set.add(id);
      }else{
        set.delete(id)
      }
      setGenresFilter(Array.from(set))
    }


    runCounter.current = runCounter.current +1;
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
            sections={genres}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item, section }) =>
              <Item style={{paddingLeft:30}} id={item.id}>{item.title}</Item>}
            renderSectionHeader={({ section: { title, id } }) => (
              <Item id={id} >{title}</Item>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

