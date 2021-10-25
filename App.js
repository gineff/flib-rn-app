import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { StyleSheet, Text, View, Button } from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomSidebarMenu from "./CustomSidebarMenu";
import BooksProvider  from "./Provider/BooksProvider";
import NewBooks  from "./Components/NewBooks";
import Book  from "./Components/Book";
import BooksView from "./Components/BooksView";
import {TasksView} from "../realm-tutorial-react-native/views/TasksView";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const appId = "application-0-rgont";


const Sidebar = (props)=> {
  return     <Drawer.Navigator
    screenOptions={{
      headerStyle: {
          backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleAlign: 'center'
    }}
    initialRouteName = "NewForWeek"
    drawerContent={(props) => <CustomSidebarMenu {...props} />}>
    //два типа истончика данных:
    //1. opds библиотека флибусты
    //2. сайт флибусты
    <Drawer.Screen
      name="Популярные книги за день"
      initialParams={{queryType: "popularDay", parseType: "html"}}
      options={{
        groupName: 'Популярные книги',
        drawerLabel: 'Популярные книги за день',
        activeTintColor: '#f4511e',
      }}
      component={NewBooks}
    />
    <Drawer.Screen
      name="Популярные книги за неделю"
      initialParams={{queryType: "popularWeek", parseType: "html"}}
      options={{
        groupName: 'Популярные книги',
        drawerLabel: 'Популярные книги за неделю',
        activeTintColor: '#f4511e',
      }}
      component={NewBooks}
    />
    <Drawer.Screen
      name="NewForWeek"
      initialParams={{getUrl:(page)=>`/opds/new/${page-1}/new/`}}
      options={{
        groupName: 'Новики',
        drawerLabel: 'Новинки за неделю',
        activeTintColor: '#f4511e',
      }}
      component={NewBooks}
    />

    </Drawer.Navigator>
};

export default function App() {


  return (<NavigationContainer>
    <Stack.Navigator>
        <Stack.Screen
            name="Sidebar"
            component={Sidebar}
            options={{ headerShown: false }}
        />
      <Stack.Screen name="Book List">
        {(props)=> {
          const params = props.route.params;
          return (<BooksProvider {{...params}}>
            <BooksView {{...props}}/>
          </BooksProvider>)
        }}
      </Stack.Screen>
      <Stack.Screen
          name="Book"
          component={Book}
      />
    </Stack.Navigator>
  </NavigationContainer>)
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
