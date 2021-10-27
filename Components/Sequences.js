import * as React from "react";
import {Text, View} from "react-native";
import { NavigationContext} from '@react-navigation/native';
import {Colors} from "../Styles";



const Sequences = ({sequencesTitle, sequencesId, style}) => {
  const navigation = React.useContext(NavigationContext);
  return (<>
    {!!sequencesTitle?.length && (
      <View style={{flexDirection: "row", marginBottom: 5}}>
        <Text style={{...style, color: Colors.prime}}>Серия: </Text>
        {sequencesTitle.map( (el, i)=> (
          <Sequence key={i} style={style} navigation={navigation} sequencesId={sequencesId[i]}>{el}</Sequence>))}
      </View>)}

  </>)
};

const Sequence = ({navigation, sequencesId, children, style})=> {

  const handlePress = ()=> {
    navigation.push("BooksList",{query: sequencesId, queryType: "sequence", source: "opds"})
  };
  return <Text onPress={handlePress} style={{...style, color: Colors.prime}}>{children}</Text>
};

export default Sequences;