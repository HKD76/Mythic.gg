import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import tw from "twrnc";
import { useRoute } from "@react-navigation/native";
import { getMatchDetails, getStatsByRank } from "../api/matches";
import CustomText from "../components/CustomText";

const MatchDetailsScreen = () => {
  const route = useRoute();
  const { matchId } = route.params;
  const [loading, setLoading] = useState(true);
  const [matchDetails, setMatchDetails] = useState(null);
  const [sqlStats, setSqlStats] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const matchData = await getMatchDetails(matchId);
        setMatchDetails(matchData);
        console.log("matchData", matchData);

        if (
          matchData &&
          matchData.info &&
          matchData.info.participants &&
          matchData.info.participants.length > 0
        ) {
          const playerRank = matchData.info.participants[0].rank;
          const sqlData = await getStatsByRank(playerRank);
          setSqlStats(sqlData);
        }
      } catch (error) {
        console.error("Error fetching match details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [matchId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!matchDetails) {
    return (
      <View>
        <Text>No match details found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`p-4`}>
      <View>
        <CustomText weight={"Sbold"} style={tw`text-2xl mb-4`}>
          Match Details
        </CustomText>
        {matchDetails.info.participants.map((participant, index) => (
          <View key={index} style={tw`mb-4`}>
            <CustomText weight={"Bmedium"} style={tw`text-lg`}>
              {participant.summonerName}
            </CustomText>
            <CustomText>Kills: {participant.kills}</CustomText>
            <CustomText>Deaths: {participant.deaths}</CustomText>
            <CustomText>Assists: {participant.assists}</CustomText>
            <CustomText>Rank: {participant.rank}</CustomText>
          </View>
        ))}
        {sqlStats && (
          <View>
            <CustomText weight={"Sbold"} style={tw`text-xl mt-4`}>
              SQL Stats for Rank
            </CustomText>
            {sqlStats.map((stat, index) => (
              <View key={index} style={tw`mb-4`}>
                <CustomText>Kills: {stat.kills}</CustomText>
                <CustomText>Deaths: {stat.deaths}</CustomText>
                <CustomText>Assists: {stat.assists}</CustomText>
                <CustomText>Gold Earned: {stat.gold_earned}</CustomText>
                <CustomText>
                  Minions Killed: {stat.total_minions_killed}
                </CustomText>
                <CustomText>Damage Dealt: {stat.damage_dealt}</CustomText>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default MatchDetailsScreen;
