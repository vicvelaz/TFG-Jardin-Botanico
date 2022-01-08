import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { MainMenu } from '../screens/MainMenu';
import { List } from '../screens/List';
import { MapScreen } from '../screens/MapScreen';
import { Planta } from '../screens/Planta';

export type RootStackParams = {
  MainMenu: undefined;
  List: String;
  MapScreen:undefined;
  Planta: undefined;
}


const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainMenu" component={MainMenu} options={{headerShown:false}}/>
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ title:"Mapa" }}/>
      <Stack.Screen name="Planta" component={Planta} options={{ title:"Rosa" }}/>
    </Stack.Navigator>
  );
}