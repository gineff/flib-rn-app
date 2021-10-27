import React from 'react';
import { StyleSheet, Button} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from './Styles'

import { NavigationContainer } from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {BooksProvider}  from "./Provider/BooksProvider";

import CustomSidebarMenu from "./CustomSidebarMenu";
import Book  from "./Components/Book";
import BooksView from "./Components/BooksView";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const provider = (props)=> {
  const { navigation, route} = props;
  const params = props.route.params;
  return (<BooksProvider {...params}>
    <BooksView navigation={navigation} route={route} />
  </BooksProvider>)
}

const screenOptions = ({navigation, route})=>({
  headerStyle: {
    backgroundColor: Colors.prime,
  },
  headerTintColor: '#fff',
  headerTitleAlign: 'center',
  headerRight: () => (
    <Icon.Button
      onPress={() => alert('This is a button!')}
      name="filter"
      color="#FFF"
      backgroundColor={Colors.prime}
    />
  )
})

const Sidebar = (props)=> {
  return     <Drawer.Navigator

    screenOptions={screenOptions}
    initialRouteName = "newForWeek"
    drawerContent={(props) => <CustomSidebarMenu {...props} />}>

    <Drawer.Screen
      name="popularForDay"
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
      name="popularForWeek"
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
      name="newForWeek"
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

  return (<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
            name="Sidebar"
            component={Sidebar}
            options={{ headerShown: false }}
        />

        <Stack.Screen name="BooksList">
          {provider}
        </Stack.Screen>
        <Stack.Screen
            name="Book"
        >
          {(props)=> {
            const { navigation, route} = props;
            const params = props.route.params;
            return (<BooksProvider {...params}>
              <Book navigation={navigation} route={route} />
            </BooksProvider>)
          }}
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
