import NewBooks from "./NewBooks";
import {Button} from "react-native";
import NewBooksByAuthor from "./NewBooksByAuthor";
import {NavigationContainer} from "@react-navigation/native";
import React from "react";

<NavigationContainer>
    <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
            headerStyle: {
                backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center'
        }}

    >
        <Stack.Screen
            name="Home"
            component={NewBooks}
            options={{
                title: 'Новые книги',

                headerLeft: () => (
                    <Button
                        onPress={() => alert('This is a button!')}
                        title="Info"
                        color="#fff"
                    />)
            }}
        />
        <Stack.Screen
            name="NewBooksByAuthor"
            component={NewBooksByAuthor}
            options={{
                title: 'Новые книги по автору',

            }}
        />
    </Stack.Navigator>
</NavigationContainer>