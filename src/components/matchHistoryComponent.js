import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import useFetchData from '../hooks/useFetchData';

const HomeScreen = () => {
  const { data, loading, error } = useFetchData();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>{data ? data.message : 'No Data'}</Text>
    </View>
  );
};

export default HomeScreen;
