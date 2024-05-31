import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import useFetchData from '../hooks/useFetchData';

const HomeScreen = () => {
  const { data, loading, error } = useFetchData('/match-history/f9pT-PPe4XdUkewvFHUosFOmzpsFYjs0_2VQB9VB5w3-LAKw6o6ZsrFKvidNIPYshnBmPccKPTCOhQ');

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text>Match History:</Text>
      {data ? (
        data.map((matchId, index) => (
          <Text key={index}>{matchId}</Text>
        ))
      ) : (
        <Text>No Match Data</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
  },
});

export default HomeScreen;
