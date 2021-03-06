import React, {useRef, useState} from 'react';
import { StyleSheet, Button} from 'react-native';

import { Colors } from './Styles'

import { NavigationContainer } from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {BooksProvider}  from "./Provider/BooksProvider";

import CustomSidebarMenu from "./CustomSidebarMenu";
import Book  from "./Components/Book";
import BooksView from "./Components/BooksView";
import FilterView from "./Components/FilterListView";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const provider = (props)=> {
  const { navigation, route} = props;
  const params = props.route.params;
  return (<BooksProvider {...params}>
    <BooksView navigation={navigation} route={route} />
  </BooksProvider>)
}



const Sidebar = (props)=> {

  const screenOptions = ({navigation, route})=>({
    headerStyle: {
      backgroundColor: Colors.prime,
    },
    headerTintColor: '#fff',
    headerTitleAlign: 'center'
  })

  return     <Drawer.Navigator
    screenOptions={screenOptions}
    initialRouteName = "Новинки за неделю"
    drawerContent={(props) => <CustomSidebarMenu {...props} />}>

    <Drawer.Screen
      name="Популярные за день"
      initialParams={{queryType: "popularForDay", source: "html", title: "Популярные книги за день"}}
      options={{
        groupName: 'Популярные книги',
        drawerLabel: 'Популярные книги за день',
        activeTintColor: Colors.prime,
      }}
    >
      {provider}
    </Drawer.Screen>
    <Drawer.Screen
      name="Популярные за неделю"
      initialParams={{queryType: "popularForWeek", source: "html", title: "Популярные книги за неделю"}}
      options={{
        groupName: 'Популярные книги',
        drawerLabel: 'Популярные книги за неделю',
        activeTintColor: Colors.prime,
      }}
    >
      {provider}
    </Drawer.Screen>
    <Drawer.Screen
      name="Новинки за неделю"
      initialParams={{queryType: "newForWeek", source: "opds", title: "Новинки за неделю"}}
      options={{
        groupName: 'Новики',
        drawerLabel: 'Новинки за неделю',
        activeTintColor: Colors.prime,
      }}
    >
      {provider}
    </Drawer.Screen>



    </Drawer.Navigator>
};

export default function App() {

  const runFilterCounter  = useRef(0);

  console.log("app render",runFilterCounter.current )
  runFilterCounter.current = runFilterCounter.current + 1;

  const screenOptions = ({navigation, route})=>({
    headerStyle: {
      backgroundColor: Colors.prime,
    },
    headerTintColor: '#fff',
    headerTitleAlign: 'center'
  })


  return (<NavigationContainer>
      <Stack.Navigator
        screenOptions={screenOptions}
      >
        <Stack.Screen
            name="Sidebar"
            component={Sidebar}
            options={{
              headerShown: false

            }}
        />

        <Stack.Screen name="BooksList">
          {provider}
        </Stack.Screen>
        <Stack.Screen  name="Book">
          {
            (props)=> {
              const { navigation, route} = props;
              const params = props.route.params;
              return (<BooksProvider {...params}>
                <Book navigation={navigation} route={route} />
              </BooksProvider>)
            }
          }
        </Stack.Screen>
        <Stack.Screen name="Filter" component={FilterView}>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer> )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    width: '100%',
    padding: 16,
    paddingTop: 100,
  }
});
