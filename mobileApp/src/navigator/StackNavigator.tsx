import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { MainMenu } from '../screens/MainMenu';
import { List } from '../screens/List';
import { MapScreen } from '../screens/MapScreen';
import { ItemDetails } from '../screens/ItemDetails';

export type RootStackParams = {
  MainMenu: undefined;
  List: String;
  MapScreen:undefined;
  ItemDetails: String;
}


const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainMenu" component={MainMenu} options={{headerShown:false}}/>
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ title:"Mapa" }}/>
      <Stack.Screen name="ItemDetails" component={ItemDetails}/>
    </Stack.Navigator>
  );
}