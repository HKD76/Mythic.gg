import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { initializeRiotApiClient, riotApiClient } from '../api/riotApiClient';

const ExampleComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await initializeRiotApiClient();
      try {
        const response = await riotApiClient.get('/lol/match/v5/matches/by-puuid/f9pT-PPe4XdUkewvFHUosFOmzpsFYjs0_2VQB9VB5w3-LAKw6o6ZsrFKvidNIPYshnBmPccKPTCOhQ/ids');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Data: {JSON.stringify(data, null, 2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default ExampleComponent;
