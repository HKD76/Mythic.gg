import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, Image } from 'react-native';
import apiClient from '../api/apiClient';
import UsernameTagInput from '../components/UsernameTagInput'; // Importer le composant personnalisé

const SearchScreen = () => {
  const [username, setUsername] = useState('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [puuidData, setPuuidData] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    setProfileData(null);
    setPuuidData(null);

    try {
      const puuidResponse = await apiClient.get(`/account/${username}/${tag}`);
      const puuidData = puuidResponse.data;
      setPuuidData(puuidData);

      const profileResponse = await apiClient.get(`/account-puuid/${puuidData.puuid}`);
      const profileData = profileResponse.data;
      setProfileData(profileData);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchProfile = () => {
    fetchProfile();
  };

  const profileIconUrl = profileData ? `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/profileicon/${profileData.profileIconId}.png` : null;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <UsernameTagInput 
          username={username} 
          tag={tag} 
          setUsername={setUsername} 
          setTag={setTag} 
        />
        <Button title="Fetch Profile" onPress={handleFetchProfile} />
      </View>

      {loading && <ActivityIndicator size="large" />}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      {profileData && puuidData && (
        <View style={styles.box}>
          <Text style={styles.title}>Profile Data</Text>
          {profileIconUrl && <Image source={{ uri: profileIconUrl }} style={styles.profileIcon} />}
          <Text style={styles.text}>PUUID: {puuidData.puuid}</Text>
          <Text style={styles.text}>Summoner Name: {puuidData.gameName}</Text>
          <Text style={styles.text}>Tag Line: {puuidData.tagLine}</Text>
          <Text style={styles.text}>Summoner Level: {profileData.summonerLevel}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  box: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
  },
});

export default SearchScreen;