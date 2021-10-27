import * as React from "react";
import {Text} from "react-native";
import { NavigationContext} from '@react-navigation/native';
import {Colors} from "../Styles";

const Authors = ({authors, style}) => {
  const navigation = React.useContext(NavigationContext);
  return (<>
    {authors.map(author => <Author style={style} navigation = {navigation} key={author.id}>{author}</Author>)}
  </>)
};

const Author = ({children, navigation, style})=> {
  return (
    (<Text
      style={{...style, color: Colors.prime}}
      onPress = {()=> {navigation.push("BooksList",{query: children.id, queryType: "author", source: "opds"});}}
      key={children.id}>
      {children.name}
    </Text>)
  )
};

export default Authors;