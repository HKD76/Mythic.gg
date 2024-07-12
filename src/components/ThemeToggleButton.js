import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useTheme as useNavTheme } from "@react-navigation/native";

const ThemeToggleButton = () => {
  const { toggleTheme, isDarkTheme } = useTheme();
  const { colors } = useNavTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.buttonText }]}>
      <Button
        title={isDarkTheme ? "Light Mode" : "Dark Mode"}
        onPress={toggleTheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});

export default ThemeToggleButton;
