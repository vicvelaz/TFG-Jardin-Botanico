import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { MainMenu } from '../screens/MainMenu';
import { List } from '../screens/List';
import { MapScreen } from '../screens/MapScreen';
import { PlantDetails } from '../screens/PlantDetails';
import { ItineraryDetails } from '../screens/ItineraryDetails';
import { ShowItemPosition } from '../screens/ShowItemPosition';

export type RootStackParams = {
  MainMenu: undefined;
  List: String;
  MapScreen:undefined;
  PlantDetails: String;
  ItineraryDetails: String;
  ShowItemPosition:undefined;
}


const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainMenu" component={MainMenu} options={{headerShown:false}}/>
      <Stack.Screen name="List" component={List} options={{headerShown:false}}/>
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ title:"Mapa" }}/>
      <Stack.Screen name="ShowItemPosition" component={ShowItemPosition} options={{ title:"Mostrar Ubicación" }}/>
      <Stack.Screen name="PlantDetails" component={PlantDetails}/>
      <Stack.Screen name="ItineraryDetails" component={ItineraryDetails}/>
    </Stack.Navigator>
  );
}