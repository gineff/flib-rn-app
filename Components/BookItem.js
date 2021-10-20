import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

const proxyImageUrl ="https://images.weserv.nl/?url=";
const createImageUrl = (cover)=> {
  return proxyImageUrl+ "http://flibusta.is" + cover +"&h=500" ;
};
const Cover = ({item})=> {
 // console.log(item.image)
  return <View style={{height:157, width: 100, backgroundColor: "lightgrey", marginRight: 10, justifyContent: "center", alignContent: "center"}}>
    {item.image?
      (<Image  style={styles.cover} source={{uri: createImageUrl(item.image) }} />) :
      (<Text style={{textAlign: 'center'}}>{item.title}</Text>)
    }
  </View>
};



export default ({book, navigation})=> {
  const {item, index} = book;

  const Authors = () => {
    return (<>
      {item.author.map(author => <Author key={author.id}>{author}</Author>)}
    </>)
  };

  const Author = ({children})=> {
    return (
      (<Text
          style={{color:'#f4511e', paddingLeft: 15}}
          onPress = {()=> {navigation.push("BookList",{query: children.id, queryType: "author"});}}
          key={children.id}>
        {children.name}
      </Text>)
    )
  };

  const Content = ({children})=> {
    const content = item.content && item.content
        .replace(/<br\/>(.*?)$/g,"")
        .replace(/<p class=\"book"\>/g,"\t")
        .replace(/(<\/p>)|(<br>)|(<b>)|(<\/b>)|(<i>)|(<\/i>)/g,"");

    return <>{item.content && (<Text numberOfLines={10}   style={{paddingTop: 5}}>{content}</Text>)}</>
  };

  const Sequences = () => {
    return (<>
      {!!item?.sequencesTitle.length && (
          <View style={{flexDirection: "row", marginBottom: 5, paddingLeft: 15}}>
            <Text style={{color:'#f4511e'}}>Серия: </Text>
            {item.sequencesTitle.map( (el, i)=> (
                <Sequence key={i} sequencesId={item.sequencesId[i]}>{el}</Sequence>))}
          </View>)}

    </>)
  };

  const Sequence = ({sequencesId, children})=> {
    const handlePress = ()=> {
      navigation.push("BookList",{query: sequencesId, queryType: "sequence"})
    };
    return <Text onPress={handlePress} style={{color:'#f4511e'}}>{children}</Text>
  };

  return (
      <View style={styles.listItem} >
        <View  >
          <Cover  item={item}/>
          <Text style={{textAlign: 'center', fontWeight: "bold"}}>{item?.year}</Text>
        </View>
        <View style={{flexDirection: "column", paddingHorizontal: 0,  flex: 1, width: "100%"}}>
          {/*title*/}
          <Text onPress = {()=> {navigation.navigate("Book",{book})}} style={{fontWeight: "bold", paddingBottom: 5}}>{index+". "+item.title}</Text>
          <Sequences/>
          <Authors/>
          <Content/>
        </View>
      </View>
  )
}


const styles = StyleSheet.create({
  cover: {
    height: 157,
    width: 100,
    marginRight: 10
  },
  listItem: {
    flex:1,
    flexDirection: "row",
    backgroundColor: 'rgba(255,255,255,0)',
    borderWidth: 1,
    borderColor: '#aa3400',
    padding: 10,
  }
});