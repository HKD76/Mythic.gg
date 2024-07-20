import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { useTheme as useNavTheme } from "@react-navigation/native";
import ArrowRightIcon from "../../assets/images/nav/right-arrow.svg";
import tw from "twrnc";

const SettingsScreen = ({ navigation }) => {
  const { toggleTheme, isDarkTheme } = useTheme();
  const { colors } = useNavTheme();
  const [isEnabled, setIsEnabled] = useState(isDarkTheme);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme !== null) {
        setIsEnabled(storedTheme === "dark");
      }
    };
    loadTheme();
  }, []);

  const toggleSwitch = async () => {
    const newTheme = isEnabled ? "light" : "dark";
    setIsEnabled(!isEnabled);
    await AsyncStorage.setItem("theme", newTheme);
    toggleTheme();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={tw`flex-row items-center`}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.iconContainer}>
            <ArrowRightIcon width={15} height={15} fill="white" />
          </View>
          <Text style={[styles.headerText, { color: colors.text }]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={[styles.text, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          trackColor={{ false: colors.border, true: colors.globalred }}
          thumbColor={"white"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  iconContainer: {
    transform: [{ rotate: "180deg" }],
  },
});

export default SettingsScreen;
