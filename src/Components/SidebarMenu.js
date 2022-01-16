import React from "react";
import {Colors} from "../Styles";
const Drawer = createDrawerNavigator();
import CustomSidebarMenu from "../../CustomSidebarMenu";
import BooksView from "./BooksView";
import SearchView from "./SearchView";
import {createDrawerNavigator} from "@react-navigation/drawer";


const SidebarMenu = (props)=> {

  //source html - source of data: http://flibusta.is/stat/(w||24)
  //source opds - source of data: http://flibusta.is/opds
  //queryType - books list query type (id)

  return     <Drawer.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: Colors.prime,
      },
      headerTintColor: '#fff',
      headerTitleAlign: 'center'
    }}
    initialRouteName = "Популярные за неделю"
    drawerContent={(props) => <CustomSidebarMenu {...props} />}>

    <Drawer.Screen
      name="Популярные за день"
      initialParams={{queryType: "popularForDay", source: "html", title: "Популярные книги за день"}}
      options={{
        groupName: 'Популярные книги',
        drawerLabel: 'Популярные книги за день',
        activeTintColor: Colors.prime,
      }}
      component={BooksView}
    />
    <Drawer.Screen
      name="Популярные за неделю"
      initialParams={{queryType: "popularForWeek", source: "html", title: "Популярные за неделю"}}
      options={{
        groupName: 'Популярные книги',
        drawerLabel: 'Популярные книги за неделю',
        activeTintColor: Colors.prime,
      }}
      component={BooksView}
    />
    <Drawer.Screen
      name="Новинки за неделю"
      initialParams={{queryType: "newForWeek", source: "opds", title: "Новинки за неделю"}}
      options={{
        groupName: 'Новики',
        drawerLabel: 'Новинки за неделю',
        activeTintColor: Colors.prime,
      }}
      component={BooksView}
    />
    <Drawer.Screen
      name="Поиск"
      options={{
        groupName: 'Поиск',
        drawerLabel: 'Поиск книги',
        activeTintColor: Colors.prime,
      }}
      component={SearchView}
    />
  </Drawer.Navigator>
};

export default SidebarMenu;