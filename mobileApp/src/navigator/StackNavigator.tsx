import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { MainMenu } from '../screens/MainMenu';
import { PlantsList } from '../screens/PlantsList';
import { PuntosInteresList } from '../screens/PuntosInteresList';
import { MapScreen } from '../screens/MapScreen';
import { ItinerariosList } from '../screens/ItinerariosList';

const Stack = createStackNavigator();

export const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainMenu" component={MainMenu} options={{headerShown:false}}/>
      <Stack.Screen name="PlantsList" component={PlantsList} options={{ title:"Lista de plantas" }}/>
      <Stack.Screen name="PuntosInteresList" component={PuntosInteresList} options={{ title:"Lista de puntos de interés" }} />
      <Stack.Screen name="ItinerariosList" component={ItinerariosList} options={{ title:"Lista de itinerarios" }}/>
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ title:"Mapa" }}/>
    </Stack.Navigator>
  );
}