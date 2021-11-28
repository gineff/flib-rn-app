import React, {useRef} from 'react';
import { StyleSheet} from 'react-native';
import { Colors } from './src/Styles'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SidebarMenu from "./src/Components/SidebarMenu";
import BooksView from "./src/Components/BooksView";
import BookView  from "./src/Components/BookView";

const Stack = createNativeStackNavigator();

export default function App() {


  console.log("app render");

  return (<NavigationContainer>
      <Stack.Navigator  screenOptions={{
        headerStyle: {
          backgroundColor: Colors.prime,
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center'
      }}>
        <Stack.Screen name="SidebarMenu" component={SidebarMenu} options={{headerShown: false}}/>
        <Stack.Screen name="BooksList" component={BooksView}/>
        <Stack.Screen name="Book" component={BookView}/>

      </Stack.Navigator>
    </NavigationContainer> )
}

