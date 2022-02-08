import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "../../Styles";

const Stars = ({marks, size})=> {

  const [people = 0, mark = 0] = marks || [];

  let stars = [];
  for(let i=0; i<5; i++) {
    stars.push(   <Icon name={(i+1) <= mark?
      "star" :
      ((i+1) > mark && i < mark)?
        "star-half" :
        "star-outline"
    } key={i} style={styles.star} size={size || 30}/> )
  }
  return   <View style={styles.stars}>
      {(Platform.OS === "web")? (<Text styles={{color: Colors.prime}}>Средня оценка {mark}</Text>) : stars}
    </View>

}

export default React.memo(Stars)

const styles = StyleSheet.create({

  starsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
  },
  star: {
    color: Colors.prime
  }

})