import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useTheme } from "../context/ThemeContext";
import ThemeToggleButton from "./ThemeToggleButton";
const AppContainer = ({ children }) => {
  const { isDarkTheme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, isDarkTheme ? styles.dark : styles.light]}
    >
      <View style={styles.content}>{children}</View>
      {/* <View style={styles.footer}>
        <ThemeToggleButton />
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  dark: {
    color: "#ffffff",
    backgroundColor: "#242222",
  },
  light: {
    color: "#242222",
    backgroundColor: "#ffffff",
  },
});

export default AppContainer;
