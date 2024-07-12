import React, { createContext, useState, useContext } from "react";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";

const ThemeContext = createContext();

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    globalred: "#EF5252",
    background: "#ffffff",
    box: "#EFEDED",
    card: "#EFEDED",
    text: "#514444",
    textBg: "#ffffff",
    border: "#cccccc",
    placeholder: "#999999",
    buttonBackground: "#EF5252",
    buttonText: "#ffffff",
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    globalred: "#EF5252",
    background: "#242222",
    box: "#000000",
    card: "#403A3A",
    text: "#EFEDED",
    textBg: "#ffffff",
    border: "#cccccc",
    placeholder: "#999999",
    buttonBackground: "#EF5252",
    buttonText: "#ffffff",
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkTheme,
        toggleTheme,
        theme: isDarkTheme ? CustomDarkTheme : CustomLightTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
