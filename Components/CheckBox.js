import React, { useState, useEffect, useRef } from "react";
import {View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {Colors} from "../Styles";

export default ({checked, style})=> {

  return (<View style={{...style}} >
    <Icon name= {checked? "checkbox-outline" : "square-outline"} size={30} color="#000" />
  </View>)
}