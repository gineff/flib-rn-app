import React from 'react';
import {Text, View} from 'react-native';
import {Colors} from "../Styles";

export default ({children})=> {
  return (<View style={{padding: 15}}>
    {children.map((comment, i) => (<View style={{paddingBottom: 15}} key={i}>
      {/* header */}
      <View style={{paddingBottom:4, flexDirection: "row", justifyContent: "space-between", borderBottomColor: "grey", borderBottomWidth: 2}}>
        <View style={{ flexDirection: "row"}}>
          <Text style={{color:"#e34c4c", fontWeight:"bold", minWidth: 10, paddingRight: 5}}>{comment?.author}</Text>
          <Text style={{color:"grey", fontSize:10, alignSelf: "flex-end"}}>{comment?.date}</Text>
        </View>
        <View>
          <Text syle={{}}>{`Оценка: ${comment?.mark? comment.mark : ""}`}</Text>
        </View>
      </View>
      <Text style={{backgroundColor:"rgba(245,78,78,0.13)"}}>{comment?.text}</Text>

    </View>))}
  </View>)
}