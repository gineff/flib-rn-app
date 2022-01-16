import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import { NavigationContext } from '@react-navigation/native';

const Sequences = ( {sequencesTitle, sequencesId}) => {
  const navigation = React.useContext(NavigationContext);
  return (<>
    {sequencesTitle.map( (el, i)=> (
      <Sequence key={i} navigation={navigation} sequencesId={sequencesId[i]}>{el}</Sequence>))}
 </>)
};

const Sequence = ({navigation, sequencesId, children})=> {
  const onPress = ()=> {
    navigation.push("BooksList",{query: sequencesId, queryType: "sequence", source: "opds"})
  }
  return <Text onPress={onPress} style={styles.bookSequence}>
    {children?.replace("#","")} /Серия/</Text>
};

const styles = StyleSheet.create({
  bookSequence: {
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
})

export default React.memo(Sequences);