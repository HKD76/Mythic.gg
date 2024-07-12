import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const UsernameTagInput = ({
  username,
  tag,
  setUsername,
  setTag,
  onSubmitEditing,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <TextInput
        style={[
          styles.input,
          styles.leftInput,
          { color: colors.text },
          { borderColor: colors.border },
        ]}
        placeholder="Enter Summoner's name"
        placeholderTextColor={colors.placeholder}
        value={username}
        onChangeText={setUsername}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="done"
      />
      <TextInput
        style={[styles.input, styles.rightInput, { color: colors.text }]}
        placeholder="#Tag"
        placeholderTextColor={colors.placeholder}
        value={tag}
        onChangeText={setTag}
        maxLength={4}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="done"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    width: "80%",
  },
  input: {
    height: 40,
    paddingHorizontal: 8,
    flex: 1,
  },
  leftInput: {
    borderRightWidth: 1,
  },
  rightInput: {
    textTransform: "uppercase",
    flex: 0.3,
  },
});

export default UsernameTagInput;
