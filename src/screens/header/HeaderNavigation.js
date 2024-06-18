import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HeaderNavigation = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Search" onPress={() => navigation.navigate('Search')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default HeaderNavigation;
