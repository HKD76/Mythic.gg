import React from 'react';
import { View, StyleSheet } from 'react-native';

const AppContainer = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242222',
    padding: 16,
  },
});

export default AppContainer;