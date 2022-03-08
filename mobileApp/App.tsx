import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { StackNavigator } from './src/navigator/StackNavigator';



const App = () => {
  return (
    <NavigationContainer>
        <StackNavigator />
        {/* <MainMenu/> */}
    </NavigationContainer>
  )
}
export default App;
