import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const HomeScreen = () => {
  const { isDarkTheme } = useTheme();

  return (
    <View style={[styles.container, isDarkTheme ? styles.dark : styles.light]}>
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dark: {
    backgroundColor: "#242222",
  },
  light: {
    backgroundColor: "#f5f5f5",
  },
  text: {
    color: "#000",
  },
});

export default HomeScreen;
