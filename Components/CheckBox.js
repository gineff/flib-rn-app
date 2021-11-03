import React, { useState, useEffect, useRef } from "react";
import {View, TouchableWithoutFeedback} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "../Styles";

export default ({checked, onPress, style, children})=> {

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={{...style, flexDirection: "row"}} >
        <Icon name= {checked? "checkbox-outline" : "square-outline"} size={30} color = {style?.color || "#000"} />
        {children}
      </View>
    </TouchableWithoutFeedback>
 )
}