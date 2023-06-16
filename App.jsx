import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from './src/views/home'
import { DetailScreen } from './src/views/detail'

const Stack = createNativeStackNavigator()

const defaultOptions = {
  headerShown: false,
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name='HomeScreen' component={HomeScreen} options={defaultOptions} />
        <Stack.Screen name='DetailScreen' component={DetailScreen} options={defaultOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App