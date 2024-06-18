import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import { DataProvider } from './src/context/DataContext';
import HeaderNavigation from './src/screens/header/HeaderNavigation';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AppContainer from './src/components/AppContainer';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <DataProvider>
      <AppContainer>
        <NavigationContainer >
          <Stack.Navigator
            initialRouteName="Search"
            screenOptions={{
              headerShown: false,
              headerRight: () => <HeaderNavigation />,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContainer>
    </DataProvider>
  );
}

export default App;
