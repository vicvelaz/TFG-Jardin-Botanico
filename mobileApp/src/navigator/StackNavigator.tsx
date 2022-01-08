import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { MainMenu } from '../screens/MainMenu';
import { PlantsList } from '../screens/PlantsList';
import { PuntosInteresList } from '../screens/PuntosInteresList';
import { MapScreen } from '../screens/MapScreen';
import { ItinerariosList } from '../screens/ItinerariosList';
import { Planta } from '../screens/Planta';

const Stack = createStackNavigator();

export const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainMenu" component={MainMenu} options={{headerShown:false}}/>
      <Stack.Screen name="PlantsList" component={PlantsList} options={{ title:"Lista de plantas" ,cardStyle: { backgroundColor: "transparent" },}}/>
      <Stack.Screen name="PuntosInteresList" component={PuntosInteresList} options={{ title:"Lista de puntos de interés" }} />
      <Stack.Screen name="ItinerariosList" component={ItinerariosList} options={{ title:"Lista de itinerarios" }}/>
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ title:"Mapa" }}/>
      <Stack.Screen name="Planta" component={Planta} options={{ title:"Rosa" }}/>
    </Stack.Navigator>
  );
}