import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const UsernameTagInput = ({ username, tag, setUsername, setTag }) => {
  const handleTagChange = (text) => {
    if (text.length <= 4) {
      setTag(text.toUpperCase());
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, styles.leftInput]}
        placeholder="Enter Summoner's name"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, styles.rightInput]}
        placeholder="Tag"
        value={tag}
        onChangeText={handleTagChange}
        maxLength={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    width: '80%',
  },
  input: {
    height: 40,
    paddingHorizontal: 8,
  },
  leftInput: {
    flex: 3,
    borderRightWidth: 1,
    borderRightColor: 'lightgray',
  },
  rightInput: {
    flex: 1,
    textTransform: 'uppercase',
  },
});

export default UsernameTagInput;
