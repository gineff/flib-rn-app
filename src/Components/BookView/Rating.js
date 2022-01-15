import React, {memo, useState} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "../../Styles";

const Rating = ({marks})=> {

  const [people = 0, mark = 0] = marks;
  let stars = [];
  for(let i=0; i<5; i++) {
    console.log(i,mark, (i+1) <= mark)
    stars.push(   <Icon name={(i+1) <= mark?
      "star" :
      ((i+1) > mark && i < mark)?
        "star-half" :
        "star-outline"
    } key={i} style={styles.star} size={30}/> )
  }
  return    <View style={styles.ratingWrapper}>
    <View style={styles.stars}>
      <Text style={styles.text}>({mark})</Text>
      {stars}
    </View>
    <View style={styles.peopleWrapper}>
      <Text style={styles.text}>{people} </Text>
      <Icon name="person-outline" size={26}/>
    </View>
    <View style={styles.recommendation}>
      <Icon name="thumbs-up-outline"/>
    </View>
   </View>

}

export default Rating

const styles = StyleSheet.create({

  ratingWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
  },
  star: {
    color: Colors.prime
  },
  peopleWrapper: {
    flexDirection: "row",
  },
  text: {
    fontSize: 20,
    color: Colors.prime
  },
  recommendation: {

  }
})