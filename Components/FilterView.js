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
      //if(item) setGenresFilter(JSON.parse(item));
      const filter = item? JSON.parse(item) : undefined;
      const list = filter? genres.map(el=>({...el, data: el.data.map(e=>({...e, checked: !(filter.indexOf(e.id) === -1) }))})) : genres;
      setGenres(list);
    })
  },[])

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const Item = ({ children, id, style, checked }) => (
    <View style={{...style, flexDirection: "row"}}>
      <GenreCheckBox id={id} checked={checked}/>
      <Text style={{alignSelf: "center"}}>{children}</Text>
    </View>
  );

  const GenreCheckBox = ({id, checked})=> {

    const runCounter = useRef(checked);
    const [toggleCheckBox, setToggleCheckBox] = useState(checked);

    const onCheckBoxChange = (newValue) => {
      setToggleCheckBox(newValue);
      /*const filter = newValue? Array.from(new Set([...genresFilterList, id])):
        (~genresFilterList.indexOf(id) && genresFilterList.splice(genresFilterList.indexOf(id),1) && false) ||
        genresFilterList
      setGenresFilter(filter);*/
    }

    /*useEffect(()=> {
      if(runCounter.current === 1){
        setToggleCheckBox(genresFilterList.indexOf(id) !== -1)
      }
    }, [genresFilterList])*/


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
            sections={genresList}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item, section }) =>
              <Item style={{paddingLeft:30}} id={item.id} checked={item.checked}>{item.title}</Item>}
            renderSectionHeader={({ section: { title, id } }) => (
              <Item id={id} >{title}</Item>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

