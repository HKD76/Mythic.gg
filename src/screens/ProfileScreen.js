import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const ProfileScreen = ({ route }) => {
  const params = route.params || {};
  const { puuidData, profileData } = params;
  const profileIconUrl = profileData
    ? `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/profileicon/${profileData.profileIconId}.png`
    : null;

  return (
    <View style={styles.container}>
      {profileData ? (
        <View style={styles.box}>
          <Text style={styles.title}>Profile Data</Text>
          {profileIconUrl && (
            <Image
              source={{ uri: profileIconUrl }}
              style={styles.profileIcon}
            />
          )}
          <Text style={styles.text}>PUUID: {puuidData.puuid}</Text>
          <Text style={styles.text}>Summoner Name: {puuidData.gameName}</Text>
          <Text style={styles.text}>Tag Line: {puuidData.tagLine}</Text>
          <Text style={styles.text}>
            Summoner Level: {profileData.summonerLevel}
          </Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No profile data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  box: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 16,
  },
  errorText: {
    color: "red",
  },
});

export default ProfileScreen;
