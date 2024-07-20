import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import { DataProvider } from "./src/context/DataContext";
import SearchScreen from "./src/screens/SearchScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AppContainer from "./src/components/AppContainer";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import MatchDetailsScreen from "./src/screens/MatchDetailsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContainer>
          <NavigationContainerWithTheme />
        </AppContainer>
      </DataProvider>
    </ThemeProvider>
  );
}

const NavigationContainerWithTheme = () => {
  const { theme } = useTheme();
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
