import React, {useRef} from 'react';
import {StyleSheet, Text} from "react-native";
import { NavigationContext } from '@react-navigation/native';

const Authors = ({children}) => {
  const navigation = React.useContext(NavigationContext);
  return (<>
    {children.map(author => <Author navigation={navigation} key={author.id}>{author}</Author>)}
  </>)
};

const Author = ({children, navigation})=> {

  const onPress = ()=> {
    navigation.push("BooksList",{query: children.id, queryType: "author", source: "opds"})
  }
  return (
    (<Text
      style={styles.booksAuthor}
      onPress = {onPress}
      key={children.id}>
      {children.name}
    </Text>)
  )
};

const styles = StyleSheet.create({
  booksAuthor: {
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
})

export default React.memo(Authors);