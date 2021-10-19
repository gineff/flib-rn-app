import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { StyleSheet, Text, View, Button } from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomSidebarMenu from "./CustomSidebarMenu";
import NewBooks  from "./Components/NewBooks";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const appId = "application-0-rgont";

const newBooksData = [
    {title: "Новинки по жанрам", name: "genre"},
    {title: "Книги автора", name: "author"},
    {title: "Книги серии", name: "sequence"},
    {title: "Книги найденные", name: "search"},
    ];

const Sidebar = (props)=> {
    return     <Drawer.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center'
        }}
        drawerContent={(props) => <CustomSidebarMenu {...props} />}>
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
            name="Новинки за неделю"
            initialParams={{queryType: "week", parseType: "xml"}}
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
        <Stack.Screen
            name="Author"
            component={NewBooks}
            initialParams={{queryType: "author", parseType: "xml"}}
        />
        {/*   {newBooksData.map((el=> (<Stack.Screen key={el.name} name={el.name} initialParams={{queryType: el.name}} component={NewBooks}/>)))} */}
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
