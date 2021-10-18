import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


import NewBooks from "./NewBooks";
export default (props)=> {
    return <View>
        <Text>Новые книги недели</Text>
        <NewBooks url="/opds/new/0/new/" {...props}/>
    </View>
}