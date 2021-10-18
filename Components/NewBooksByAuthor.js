import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
export default ({navigation})=> {
    return <View>
        <Text>Новые книги по автору</Text>
        <Button onPress={()=>{navigation.navigate("Feed")}} title="Go back"/>
    </View>
}