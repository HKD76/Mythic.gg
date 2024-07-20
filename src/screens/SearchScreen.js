import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import UsernameTagInput from "../components/UsernameTagInput";
import { useTheme as useNavTheme } from "@react-navigation/native";
import Dropdown from "../components/Dropdown";
import tw from "twrnc";
import CustomText from "../components/CustomText";
import { useNavigation } from "@react-navigation/native";

import { getAccountByRiotID, getAccountByPUUID } from "../api/account";
import { getRecentMatches } from "../api/matches";
import { getRankedStats } from "../api/rankedStats";
import { getChampionData } from "../api/champions";

import Iron from "../../assets/images/ranks/Rank=Iron.png";
import Bronze from "../../assets/images/ranks/Rank=Bronze.png";
import Silver from "../../assets/images/ranks/Rank=Silver.png";
import Gold from "../../assets/images/ranks/Rank=Gold.png";
import Platinum from "../../assets/images/ranks/Rank=Platinum.png";
import Emerald from "../../assets/images/ranks/Rank=Emerald.png";
import Diamond from "../../assets/images/ranks/Rank=Diamond.png";
import Master from "../../assets/images/ranks/Rank=Master.png";
import Grandmaster from "../../assets/images/ranks/Rank=Grandmaster.png";
import Challenger from "../../assets/images/ranks/Rank=Challenger.png";
import {
  ClipPath,
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
  Svg,
} from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const rankImages = {
  IRON: Iron,
  BRONZE: Bronze,
  SILVER: Silver,
  GOLD: Gold,
  PLATINUM: Platinum,
  EMERALD: Emerald,
  DIAMOND: Diamond,
  MASTER: Master,
  GRANDMASTER: Grandmaster,
  CHALLENGER: Challenger,
};

const SearchScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [puuidData, setPuuidData] = useState(null);
  const [rankedStats, setRankedStats] = useState(null);
  const [recentMatches, setRecentMatches] = useState(null);
  const [lastChampionSplash, setLastChampionSplash] = useState("");
  const [expandedMatches, setExpandedMatches] = useState({});
  const [recentSearches, setRecentSearches] = useState([]);

  const { colors } = useNavTheme();

  const [selectedChampion, setSelectedChampion] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [championOptions, setChampionOptions] = useState([
    { label: "Aucun choix", value: null },
  ]);

  const queueOptions = [
    { label: "Aucun choix", value: null },
    { label: "Ranked", value: 420 },
    { label: "Normal", value: 430 },
    { label: "ARAM", value: 450 },
    { label: "Flex", value: 440 },
  ];

  const roleOptions = [
    { label: "Aucun choix", value: null },
    { label: "Top", value: "TOP" },
    { label: "Jungle", value: "JUNGLE" },
    { label: "Mid", value: "MIDDLE" },
    { label: "ADC", value: "BOTTOM" },
    { label: "Support", value: "UTILITY" },
  ];
  const [isRecentSearchSelected, setIsRecentSearchSelected] = useState(false);

  const saveRecentSearch = async (username, tag) => {
    try {
      const currentSearch = { username, tag };
      const searches = await AsyncStorage.getItem("recentSearches");
      let searchesArray = searches ? JSON.parse(searches) : [];
      searchesArray = [
        currentSearch,
        ...searchesArray.filter(
          (search) => search.username !== username || search.tag !== tag
        ),
      ].slice(0, 5);
      await AsyncStorage.setItem(
        "recentSearches",
        JSON.stringify(searchesArray)
      );
      setRecentSearches(searchesArray);
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem("recentSearches");
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    setProfileData(null);
    setPuuidData(null);
    setRankedStats(null);
    setRecentMatches(null);

    try {
      const puuidData = await getAccountByRiotID(username, tag);
      setPuuidData(puuidData);

      const profileData = await getAccountByPUUID(puuidData.puuid);
      setProfileData(profileData);

      const rankedStatsData = await getRankedStats(puuidData.id);
      setRankedStats(rankedStatsData);

      const matchesData = await getRecentMatches(puuidData.puuid);
      setRecentMatches(matchesData);

      if (matchesData && matchesData.length > 0) {
        const participant = matchesData[0].info.participants.find(
          (p) => p.puuid === puuidData.puuid
        );

        if (participant) {
          const lastChampionId = participant.championId;
          const championsData = await getChampionData();

          const lastChampion = Object.values(championsData).find(
            (champion) => parseInt(champion.key) === lastChampionId
          );

          if (lastChampion) {
            const lastChampionName = lastChampion.id;
            const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${lastChampionName}_0.jpg`;
            setLastChampionSplash(splashUrl);
          }

          // Extract champions played
          const playedChampions = new Set();
          matchesData.forEach((match) => {
            const playerData = match.info.participants.find(
              (p) => p.puuid === puuidData.puuid
            );
            if (playerData) {
              playedChampions.add(playerData.championName);
            }
          });

          const championOptionsList = [
            { label: "Aucun choix", value: null },
            ...Array.from(playedChampions)
              .map((championName) => {
                const championData = Object.values(championsData).find(
                  (champion) => champion.id === championName
                );
                return championData
                  ? {
                      label: championData.name,
                      value: championData.id,
                    }
                  : null;
              })
              .filter((option) => option !== null),
          ];

          setChampionOptions(championOptionsList);
        }
      }

      await saveRecentSearch(username, tag);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response && err.response.status === 404) {
        setError("Player not found. Please check the username and tag.");
      } else {
        setError(err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPlayerData = (match, puuid) => {
    return match.info.participants.find((p) => p.puuid === puuid);
  };

  const handleFetchProfile = () => {
    fetchProfile();
  };

  const handleRecentSearchSelect = (username, tag) => {
    setUsername(username);
    setTag(tag);
    setIsRecentSearchSelected(true);
  };

  useEffect(() => {
    if (isRecentSearchSelected) {
      fetchProfile();
      setIsRecentSearchSelected(false);
    }
  }, [username, tag, isRecentSearchSelected]);

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const profileIconUrl = profileData
    ? `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/profileicon/${profileData.profileIconId}.png`
    : null;

  const getRankImage = (tier) => {
    return rankImages[tier.toUpperCase()] || null;
  };

  const getPlayerRank = (summonerId, rankedStats) => {
    const playerRank = rankedStats.find(
      (stat) => stat.summonerId === summonerId
    );
    if (playerRank) {
      return `${playerRank.tier} ${playerRank.rank}`;
    }
    return "Unranked";
  };

  const getPlayerRankData = (summonerId, rankedStats) => {
    const playerRank = rankedStats.find(
      (stat) => stat.summonerId === summonerId
    );
    return playerRank ? playerRank : null;
  };

  useEffect(() => {
    if (rankedStats) {
      console.log("rankedStats", rankedStats);
    }
  }, [rankedStats]);

  const getItemImage = (itemId) => {
    return itemId
      ? `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/item/${itemId}.png`
      : null;
  };

  const getSummonerSpellImage = (spellId) => {
    return spellId
      ? `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/spell/Summoner${spellId}.png`
      : null;
  };

  const getRuneImage = (runeId) => {
    return runeId
      ? `https://ddragon.leagueoflegends.com/cdn/img/${runeId}.png`
      : null;
  };

  const toggleMatchExpand = (matchId) => {
    setExpandedMatches((prev) => ({
      ...prev,
      [matchId]: !prev[matchId],
    }));
  };

  const formatGameDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDateToRelativeTime = (timestamp) => {
    const now = new Date();
    const matchDate = new Date(timestamp);
    const diffMs = now - matchDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minutes ago`;
    } else {
      return `${diffSeconds} seconds ago`;
    }
  };

  const getTeamStats = (team) => {
    return {
      turrets: team.objectives.tower.kills,
      drakes: team.objectives.dragon.kills,
      nashors: team.objectives.baron.kills,
    };
  };

  const truncateName = (name) => (name.length > 3 ? name.slice(0, 3) : name);

  const filteredMatches = recentMatches
    ? recentMatches.filter((match) => {
        const playerData = getPlayerData(match, puuidData.puuid);
        const matchQueue = match.info.queueId;
        const matchRole = playerData.teamPosition;

        const matchesChampion = selectedChampion
          ? playerData.championName === selectedChampion
          : true;
        const matchesQueue = selectedQueue
          ? matchQueue === selectedQueue
          : [420, 430, 450].includes(matchQueue);
        const matchesRole = selectedRole ? matchRole === selectedRole : true;

        return matchesChampion && matchesQueue && matchesRole;
      })
    : [];

  return (
    <SafeAreaView style={tw`flex-1 bg-[${colors.background}] gap-[6px]`}>
      <View style={tw`w-full items-center z-100`}>
        <UsernameTagInput
          username={username}
          tag={tag}
          setUsername={setUsername}
          setTag={setTag}
          onSubmitEditing={handleFetchProfile}
        />
      </View>

      {!profileData && !loading && recentSearches.length > 0 && (
        <View style={tw`w-full px-4`}>
          <View style={tw`rounded-[8px] py-1 bg-[${colors.globalred}]`}>
            <CustomText style={tw`text-[20px] text-center text-white`}>
              RECENT SEARCHES
            </CustomText>
          </View>
          <View style={tw`bg-[${colors.card}] rounded-[8px] p-4 pt-2 mt-2`}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={tw`p-2 border-b border-gray-300`}
                onPress={() =>
                  handleRecentSearchSelect(search.username, search.tag)
                }
              >
                <CustomText>
                  {search.username}#{search.tag}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {profileData && puuidData && (
        <ImageBackground
          source={
            lastChampionSplash
              ? {
                  uri: lastChampionSplash,
                }
              : null
          }
          imageStyle={tw``}
          style={tw`w-full bg-[${colors.card}] rounded-[10px] overflow-hidden`}
        >
          <Svg
            height="100%"
            width="100%"
            style={tw`absolute inset-0 rounded-lg`}
          >
            <Defs>
              <RadialGradient
                id="grad"
                cx="50%"
                cy="20%"
                rx="100%"
                ry="80%"
                fx="60%"
                fy="40%"
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="30%" stopColor="transparent" stopOpacity="0" />
                <Stop offset="100%" stopColor="black" stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#grad)" />
          </Svg>
          <Svg height="0" width="0" style={tw`absolute`}>
            <Defs>
              <ClipPath id="clip">
                <Rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" />
              </ClipPath>
            </Defs>
          </Svg>
          <Svg
            height="100%"
            width="100%"
            style={tw`absolute inset-0 rounded-[30px]`}
          >
            <Defs style={tw`rounded-[30]`}>
              <LinearGradient
                style={tw`rounded-[30]`}
                id="linearGrad"
                x1="0%"
                y1="15%"
                x2="0%"
                y2="100%"
              >
                <Stop
                  style={tw`rounded-[30]`}
                  offset="0%"
                  stopColor="transparent"
                  stopOpacity="0"
                />
                <Stop
                  style={tw`rounded-[30]`}
                  offset="40%"
                  stopColor={colors.card}
                  stopOpacity="1"
                />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#linearGrad)" />
          </Svg>
          <View style={tw`flex-row`}>
            <View style={tw`p-4`}>
              <View style={tw`w-25 mb-4`}>
                {profileIconUrl && (
                  <Image
                    source={
                      profileIconUrl
                        ? {
                            uri: profileIconUrl,
                          }
                        : null
                    }
                    style={tw`w-25 h-25 rounded-[40px] bg-gray-600`}
                  />
                )}
                {profileData.summonerLevel && (
                  <View
                    style={[
                      tw`absolute bottom-[-3] bg-[${colors.buttonBackground}] rounded-[10px]`,
                      { alignSelf: "center" },
                    ]}
                  >
                    <CustomText
                      weight={"Sbold"}
                      style={tw`text-white text-center font-extrabold text-[15px] p-[6px]`}
                    >
                      {profileData.summonerLevel}
                    </CustomText>
                  </View>
                )}
              </View>
              <View style={tw`flex-row items-center`}>
                <CustomText
                  weight={"M"}
                  style={tw`text-[13px] font-extrabold mr-1`}
                >
                  {puuidData.gameName}
                </CustomText>
                <View style={tw`p-[3px] bg-[${colors.text}] rounded-[5px]`}>
                  <CustomText
                    weight={"M"}
                    style={tw`text-[13px] text-[${colors.card}] font-extrabold`}
                  >
                    #{puuidData.tagLine}
                  </CustomText>
                </View>
              </View>
              <CustomText
                weight={"Bmedium"}
                style={tw`text-[13px]`}
                color={colors.CustomText}
              >
                ({puuidData.tagLine})
              </CustomText>
            </View>
            <View style={tw`flex-1 justify-end`}>
              {rankedStats && rankedStats[0] && (
                <View style={tw`flex flex-row p-4 justify-end items-end`}>
                  <View style={tw`mr-4`}>
                    <View style={tw`flex flex-row justify-end`}>
                      <CustomText weight={""} style={tw``}>
                        Soloqueue
                      </CustomText>
                    </View>
                    <View style={tw`flex flex-row justify-end`}>
                      <CustomText weight={"Bmedium"} style={tw``}>
                        Wins:&nbsp;
                      </CustomText>
                      <CustomText weight={""} style={tw``}>
                        {rankedStats[0].wins}
                      </CustomText>
                      <CustomText weight={"Bmedium"} style={tw``}>
                        :&nbsp;Losses:&nbsp;
                      </CustomText>
                      <CustomText weight={""} style={tw``}>
                        {rankedStats[0].losses}
                      </CustomText>
                    </View>
                    <View style={tw`flex flex-row justify-end`}>
                      <CustomText weight={"Bmedium"} style={tw``}>
                        LP:&nbsp;
                      </CustomText>
                      <CustomText weight={""} style={tw``}>
                        {rankedStats[0].leaguePoints}
                      </CustomText>
                    </View>
                    <View style={tw`flex flex-row justify-end`}>
                      <CustomText weight={"Bmedium"} style={tw``}>
                        Winrate:&nbsp;
                      </CustomText>
                      <CustomText weight={""} style={tw``}>
                        {(
                          (rankedStats[0].wins /
                            (rankedStats[0].wins + rankedStats[0].losses)) *
                          100
                        ).toFixed(0)}
                        %
                      </CustomText>
                    </View>
                  </View>
                  <View style={tw``}>
                    <Image
                      source={
                        rankedStats[0].tier
                          ? getRankImage(rankedStats[0].tier)
                          : null
                      }
                      style={tw`w-23 h-23 m-[-15] mb-[-10]`}
                    />

                    <CustomText
                      weight={""}
                      style={tw`text-center font-extrabold text-[15px]`}
                    >
                      {rankedStats[0].tier} {rankedStats[0].rank}
                    </CustomText>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ImageBackground>
      )}

      {recentMatches && (
        <View
          style={tw`flex-row w-full justify-between z-10 bg-[${colors.card}] p-[6px] gap-[6px] rounded-[10px]`}
        >
          <Dropdown
            isOpen={openDropdown === 0}
            toggleDropdown={() => toggleDropdown(0)}
            label="ALL CHAMPIONS"
            options={championOptions}
            onSelect={setSelectedChampion}
          />
          <Dropdown
            isOpen={openDropdown === 1}
            toggleDropdown={() => toggleDropdown(1)}
            label="ALL QUEUES"
            options={queueOptions}
            onSelect={setSelectedQueue}
          />
          <Dropdown
            isOpen={openDropdown === 2}
            toggleDropdown={() => toggleDropdown(2)}
            label="ALL ROLES"
            options={roleOptions}
            onSelect={setSelectedRole}
          />
        </View>
      )}

      {recentMatches && (
        <ScrollView style={tw`bg-[${colors.card}] p-[7px] rounded-[10px]`}>
          {filteredMatches.map((match, index) => {
            const playerData = getPlayerData(match, puuidData.puuid);
            const isVictory = playerData.win;
            const matchDuration = formatGameDuration(match.info.gameDuration);
            const matchDate = formatDateToRelativeTime(match.info.gameCreation);
            const queueType = match.info.queueId === 420 ? "Ranked" : "Normal";

            const blueTeam = match.info.teams.find(
              (team) => team.teamId === 100
            );
            const redTeam = match.info.teams.find(
              (team) => team.teamId === 200
            );

            const blueTeamStats = blueTeam
              ? getTeamStats(blueTeam)
              : { turrets: 0, drakes: 0, nashors: 0 };
            const redTeamStats = redTeam
              ? getTeamStats(redTeam)
              : { turrets: 0, drakes: 0, nashors: 0 };

            return (
              <TouchableOpacity
                key={index}
                style={[
                  tw`rounded-[7px] border-l-4 border-[${
                    isVictory ? "#3682DC" : "#DE2A34"
                  }] mb-[6px]`,
                  { overflow: "hidden" },
                ]}
                onPress={() => toggleMatchExpand(match.info.gameId)}
              >
                {!expandedMatches[match.info.gameId] ? (
                  <Svg
                    height="100%"
                    width="100%"
                    style={tw`absolute inset-0 rounded-lg`}
                  >
                    <Defs>
                      <LinearGradient id="linearGrad" x1="0%" y1="0%" x2="100%">
                        <Stop
                          offset="0%"
                          stopColor={isVictory ? "#37598C" : "#9B4E4E"}
                          stopOpacity="1"
                        />
                        <Stop
                          offset="38%"
                          stopColor={isVictory ? "#27405C" : "#5F4848"}
                          stopOpacity="1"
                        />
                      </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#linearGrad)" />
                  </Svg>
                ) : (
                  <Svg
                    height="100%"
                    width="100%"
                    style={tw`absolute inset-0 rounded-lg`}
                  >
                    <Defs>
                      <LinearGradient id="linearGrad" x1="0%" y1="0%" x2="100%">
                        <Stop
                          offset="0%"
                          stopColor={blueTeam.win ? "#37598C" : "#9B4E4E"}
                          stopOpacity="1"
                        />
                        <Stop
                          offset="38%"
                          stopColor={blueTeam.win ? "#27405C" : "#5F4848"}
                          stopOpacity="1"
                        />
                      </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#linearGrad)" />
                  </Svg>
                )}

                <View
                  style={tw`flex-row justify-between items-center border-b-[1px] border-[${
                    !expandedMatches[match.info.gameId]
                      ? isVictory
                        ? "#3682DC"
                        : "#DE2A34"
                      : blueTeam.win
                      ? "#3682DC"
                      : "#DE2A34"
                  }]`}
                >
                  {!expandedMatches[match.info.gameId] ? (
                    <>
                      <View style={tw`flex-row px-1 gap-2`}>
                        <CustomText
                          weight={""}
                          style={tw`${
                            isVictory ? "text-[#3682DC]" : "text-[#DE2A34]"
                          }`}
                        >
                          {isVictory ? "Victory" : "Defeat"}
                        </CustomText>
                        <CustomText weight={"Bmedium"} style={tw`text-white`}>
                          {matchDuration}
                        </CustomText>
                      </View>
                      <View style={tw`flex-row px-1 gap-2`}>
                        <CustomText weight={"Bmedium"} style={tw`text-white`}>
                          {queueType}
                        </CustomText>
                        <CustomText weight={"Bmedium"} style={tw`text-white`}>
                          {matchDate}
                        </CustomText>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={tw`flex-row px-1`}>
                        <CustomText weight={"Bmedium"} style={tw`text-white`}>
                          {matchDuration}
                        </CustomText>
                      </View>
                      <View style={tw`flex-row px-1 gap-2`}>
                        <CustomText weight={"Bmedium"} style={tw`text-white`}>
                          {queueType}
                        </CustomText>
                        <CustomText weight={"Bmedium"} style={tw`text-white`}>
                          {matchDate}
                        </CustomText>
                      </View>
                    </>
                  )}
                </View>
                {!expandedMatches[match.info.gameId] && (
                  <View style={tw`flex-row justify-around items-center`}>
                    <Svg
                      height="100%"
                      width="100%"
                      style={tw`absolute inset-0 rounded-lg`}
                    >
                      <Defs>
                        <LinearGradient
                          id="linearGrad"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                        >
                          <Stop
                            offset="0%"
                            stopColor={isVictory ? "#37598C" : "#9B4E4E"}
                            stopOpacity="1"
                          />
                          <Stop
                            offset="38%"
                            stopColor={isVictory ? "#27405C" : "#5F4848"}
                            stopOpacity="1"
                          />
                        </LinearGradient>
                      </Defs>
                      <Rect
                        width="100%"
                        height="100%"
                        fill="url(#linearGrad)"
                      />
                    </Svg>

                    <View style={tw``}>
                      <Image
                        source={
                          playerData.championName
                            ? {
                                uri: `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${playerData.championName}.png`,
                              }
                            : null
                        }
                        style={tw`w-[45px] h-[45px] rounded-[2px]`}
                      />
                      <View style={tw`flex-row`}>
                        <Image
                          source={
                            playerData.summoner1Id
                              ? {
                                  uri: getSummonerSpellImage(
                                    playerData.summoner1Id
                                  ),
                                }
                              : null
                          }
                          style={tw`bg-black w-[15px] h-[15px]`}
                        />
                        <Image
                          source={
                            playerData.summoner2Id
                              ? {
                                  uri: getSummonerSpellImage(
                                    playerData.summoner2Id
                                  ),
                                }
                              : null
                          }
                          style={tw`bg-black w-[15px] h-[15px]`}
                        />
                        <Image
                          source={
                            playerData.perks.styles[0].selections[0].perk
                              ? {
                                  uri: getRuneImage(
                                    playerData.perks.styles[0].selections[0]
                                      .perk
                                  ),
                                }
                              : null
                          }
                          style={tw`bg-black w-[15px] h-[15px]`}
                        />
                      </View>
                    </View>

                    <View style={tw`gap-2`}>
                      <View style={tw`flex-row justify-between`}>
                        <View style={tw`flex-1`}>
                          <View style={tw`flex-row`}>
                            <CustomText
                              weight={"Bmedium"}
                              style={tw`text-white`}
                            >
                              {playerData.kills} /&nbsp;
                            </CustomText>
                            <CustomText weight={""} style={tw`text-[#DE2A34]`}>
                              {playerData.deaths}&nbsp;
                            </CustomText>
                            <CustomText
                              weight={"Bmedium"}
                              style={tw`text-white`}
                            >
                              / {playerData.assists}
                            </CustomText>
                          </View>
                          <View style={tw`flex flex-row`}>
                            <CustomText
                              weight={"M"}
                              style={tw`text-white text-[12px]`}
                            >
                              {(
                                (playerData.kills + playerData.assists) /
                                Math.max(1, playerData.deaths)
                              ).toFixed(2)}
                            </CustomText>
                            <CustomText
                              weight={"M"}
                              style={tw`text-white text-[12px] opacity-60`}
                            >
                              &nbsp;KDA
                            </CustomText>
                          </View>
                        </View>
                        <View style={tw`flex-1`}>
                          <View style={tw`flex flex-row`}>
                            <CustomText
                              weight={"Bmedium"}
                              style={tw`text-white`}
                            >
                              {playerData.totalMinionsKilled}&nbsp;
                            </CustomText>
                            <CustomText
                              weight={"Bmedium"}
                              style={tw`text-white opacity-60`}
                            >
                              CS
                            </CustomText>
                          </View>
                          <CustomText
                            weight={"M"}
                            style={tw`text-white text-[12px]`}
                          >
                            {(
                              (playerData.kills /
                                match.info.teams.reduce(
                                  (total, team) => total + team.kills,
                                  0
                                )) *
                              100
                            ).toFixed(1)}
                            % KP
                          </CustomText>
                        </View>
                      </View>
                      <View style={tw`flex-row gap-[2px] justify-between`}>
                        {[...Array(6)].map((_, itemIdx) => (
                          <Image
                            key={itemIdx}
                            source={
                              playerData[`item${itemIdx}`]
                                ? {
                                    uri: getItemImage(
                                      playerData[`item${itemIdx}`]
                                    ),
                                  }
                                : null
                            }
                            style={tw`w-[21px] h-[21px] rounded-[5px] ${
                              !playerData[`item${itemIdx}`]
                                ? "bg-[#242222]"
                                : ""
                            }`}
                          />
                        ))}
                        <Image
                          source={
                            playerData.item6
                              ? { uri: getItemImage(playerData.item6) }
                              : null
                          }
                          style={tw`w-[21px] h-[21px] rounded-[5px] ${
                            !playerData.item6 ? "bg-[#242222]" : ""
                          }`}
                        />
                      </View>
                    </View>

                    <View style={tw`flex-row p-[5px] pr-0`}>
                      <View style={tw`gap-[2px]`}>
                        {match.info.participants
                          .slice(0, 5)
                          .map((player, idx) => {
                            const playerRankData = getPlayerRankData(
                              player.summonerId,
                              rankedStats
                            );

                            return (
                              <View
                                key={idx}
                                style={tw`flex-row items-center ${
                                  player.puuid === puuidData.puuid ? "" : ""
                                }`}
                              >
                                {player.puuid === puuidData.puuid ? (
                                  <Svg
                                    height="100%"
                                    width="100%"
                                    style={tw`absolute inset-0 rounded-lg`}
                                  >
                                    <Defs>
                                      <LinearGradient
                                        id="linearGrad"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                      >
                                        <Stop
                                          offset="50%"
                                          stopColor={"#E7A23B"}
                                          stopOpacity="1"
                                        />
                                        <Stop
                                          offset="100%"
                                          stopColor={"#000000"}
                                          stopOpacity="0"
                                        />
                                      </LinearGradient>
                                    </Defs>
                                    <Rect
                                      width="100%"
                                      height="100%"
                                      fill="url(#linearGrad)"
                                    />
                                  </Svg>
                                ) : (
                                  ""
                                )}
                                <Image
                                  source={
                                    player.championName
                                      ? {
                                          uri: `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${player.championName}.png`,
                                        }
                                      : null
                                  }
                                  style={tw`w-[15px] h-[15px] rounded-[2px]`}
                                />
                                <CustomText
                                  weight={"M"}
                                  style={tw`ml-1 text-white text-[10px]`}
                                >
                                  {truncateName(player.summonerName)}..
                                </CustomText>
                              </View>
                            );
                          })}
                      </View>

                      <View style={tw`gap-[2px]`}>
                        {match.info.participants
                          .slice(5, 10)
                          .map((player, idx) => (
                            <View
                              key={idx}
                              style={tw`flex-row items-center ${
                                player.puuid === puuidData.puuid ? "" : ""
                              }`}
                            >
                              {player.puuid === puuidData.puuid ? (
                                <Svg
                                  height="100%"
                                  width="100%"
                                  style={tw`absolute inset-0 rounded-lg`}
                                >
                                  <Defs>
                                    <LinearGradient
                                      id="linearGrad"
                                      x1="0%"
                                      y1="0%"
                                      x2="100%"
                                    >
                                      <Stop
                                        offset="50%"
                                        stopColor={"#E7A23B"}
                                        stopOpacity="1"
                                      />
                                      <Stop
                                        offset="100%"
                                        stopColor={"#000000"}
                                        stopOpacity="0"
                                      />
                                    </LinearGradient>
                                  </Defs>
                                  <Rect
                                    width="100%"
                                    height="100%"
                                    fill="url(#linearGrad)"
                                  />
                                </Svg>
                              ) : (
                                ""
                              )}
                              <Image
                                source={
                                  player.championName
                                    ? {
                                        uri: `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${player.championName}.png`,
                                      }
                                    : null
                                }
                                style={tw`w-[15px] h-[15px] rounded-[2px]`}
                              />
                              <CustomText
                                weight={"M"}
                                style={tw`ml-1 text-white text-[10px]`}
                              >
                                {truncateName(player.summonerName)}..
                              </CustomText>
                            </View>
                          ))}
                      </View>
                    </View>
                  </View>
                )}
                {expandedMatches[match.info.gameId] && (
                  <View style={tw``}>
                    <View
                      style={tw`flex-row justify-between items-center border-b-[1px] border-[${
                        blueTeam.win ? "#3682DC" : "#DE2A34"
                      }]`}
                    >
                      <Svg
                        height="100%"
                        width="100%"
                        style={tw`absolute inset-0 rounded-lg`}
                      >
                        <Defs>
                          <LinearGradient
                            id="blueTeamGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                          >
                            <Stop
                              offset="0%"
                              stopColor={blueTeam.win ? "#37598C" : "#9B4E4E"}
                              stopOpacity="1"
                            />
                            <Stop
                              offset="38%"
                              stopColor={blueTeam.win ? "#27405C" : "#5F4848"}
                              stopOpacity="1"
                            />
                          </LinearGradient>
                        </Defs>
                        <Rect
                          width="100%"
                          height="100%"
                          fill="url(#blueTeamGrad)"
                        />
                      </Svg>
                      <View style={tw`flex-row px-1 gap-2`}>
                        <CustomText
                          weight={""}
                          style={tw`${
                            blueTeam.win ? "text-[#3682DC]" : "text-[#DE2A34]"
                          }`}
                        >
                          {blueTeam.win ? "Victory" : "Defeat"}
                        </CustomText>
                      </View>
                      <View style={tw`flex-row px-1`}>
                        <CustomText weight={"Bmedium"} style={tw`text-white`}>
                          T: {blueTeamStats.turrets} D: {blueTeamStats.drakes}{" "}
                          N: {blueTeamStats.nashors}
                        </CustomText>
                      </View>
                    </View>

                    <View>
                      <Svg
                        height="100%"
                        width="100%"
                        style={tw`absolute inset-0 rounded-lg`}
                      >
                        <Defs>
                          <LinearGradient
                            id="blueTeamGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                          >
                            <Stop
                              offset="0%"
                              stopColor={blueTeam.win ? "#37598C" : "#9B4E4E"}
                              stopOpacity="1"
                            />
                            <Stop
                              offset="38%"
                              stopColor={blueTeam.win ? "#27405C" : "#5F4848"}
                              stopOpacity="1"
                            />
                          </LinearGradient>
                        </Defs>
                        <Rect
                          width="100%"
                          height="100%"
                          fill="url(#blueTeamGrad)"
                        />
                      </Svg>
                      <CustomText
                        weight={"Bmedium"}
                        style={tw`mb-2 pl-[6px] text-white`}
                      >
                        Blue Side
                      </CustomText>
                    </View>

                    <View style={tw`flex-1`}>
                      <Svg
                        height="100%"
                        width="100%"
                        style={tw`absolute inset-0 rounded-lg`}
                      >
                        <Defs>
                          <LinearGradient
                            id="blueTeamGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                          >
                            <Stop
                              offset="0%"
                              stopColor={blueTeam.win ? "#37598C" : "#9B4E4E"}
                              stopOpacity="1"
                            />
                            <Stop
                              offset="38%"
                              stopColor={blueTeam.win ? "#27405C" : "#5F4848"}
                              stopOpacity="1"
                            />
                          </LinearGradient>
                        </Defs>
                        <Rect
                          width="100%"
                          height="100%"
                          fill="url(#blueTeamGrad)"
                        />
                      </Svg>
                      {match.info.participants
                        .slice(0, 5)
                        .map((player, idx) => (
                          <View
                            key={idx}
                            style={tw`flex-row mb-2 px-2 gap-2 items-center justify-between ${
                              player.puuid === puuidData.puuid ? "" : ""
                            }`}
                          >
                            <View style={tw`flex-row items-center gap-2`}>
                              <Image
                                source={
                                  player.championName
                                    ? {
                                        uri: `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${player.championName}.png`,
                                      }
                                    : null
                                }
                                style={tw`w-10 h-10 rounded-full`}
                              />
                              <View style={tw`flex items-start`}>
                                <CustomText weight={"M"} style={tw`text-white`}>
                                  {player.summonerName}
                                </CustomText>
                                <View style={tw`flex-row`}>
                                  <CustomText
                                    weight={"Bmedium"}
                                    style={tw`text-white`}
                                  >
                                    {player.kills}/{player.deaths}/
                                    {player.assists}
                                  </CustomText>
                                </View>
                              </View>
                            </View>
                            <View style={tw`flex`}>
                              <View style={tw`flex-row`}>
                                {[...Array(7)].map((_, itemIdx) => (
                                  <Image
                                    key={itemIdx}
                                    source={
                                      player[`item${itemIdx}`]
                                        ? {
                                            uri: getItemImage(
                                              player[`item${itemIdx}`]
                                            ),
                                          }
                                        : null
                                    }
                                    style={tw`w-6 h-6 ${
                                      !player[`item${itemIdx}`]
                                        ? "bg-[#242222]"
                                        : ""
                                    }`}
                                  />
                                ))}
                              </View>
                              <View style={tw`flex-row gap-2 justify-end`}>
                                <CustomText
                                  weight={"Bmedium"}
                                  style={tw`text-white`}
                                >
                                  {player.totalMinionsKilled}&nbsp;CS -&nbsp;
                                  {player.goldEarned}&nbsp;Golds
                                </CustomText>
                              </View>
                            </View>
                          </View>
                        ))}
                    </View>

                    <View
                      style={tw`flex-row justify-between items-center border-b-[1px] border-[${
                        redTeam.win ? "#3682DC" : "#DE2A34"
                      }]`}
                    >
                      <Svg
                        height="100%"
                        width="100%"
                        style={tw`absolute inset-0 rounded-lg`}
                      >
                        <Defs>
                          <LinearGradient
                            id="blueTeamGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                          >
                            <Stop
                              offset="0%"
                              stopColor={redTeam.win ? "#37598C" : "#9B4E4E"}
                              stopOpacity="1"
                            />
                            <Stop
                              offset="38%"
                              stopColor={redTeam.win ? "#27405C" : "#5F4848"}
                              stopOpacity="1"
                            />
                          </LinearGradient>
                        </Defs>
                        <Rect
                          width="100%"
                          height="100%"
                          fill="url(#blueTeamGrad)"
                        />
                      </Svg>
                      <View style={tw`flex-row px-1 gap-2`}>
                        <CustomText
                          weight={""}
                          style={tw`${
                            redTeam.win ? "text-[#3682DC]" : "text-[#DE2A34]"
                          }`}
                        >
                          {redTeam.win ? "Victory" : "Defeat"}
                        </CustomText>
                      </View>
                      <View style={tw`flex-row px-1`}>
                        <CustomText weight={"Bmedium"} style={tw`text-white`}>
                          T: {redTeamStats.turrets} D: {redTeamStats.drakes} N:{" "}
                          {redTeamStats.nashors}
                        </CustomText>
                      </View>
                    </View>

                    <View>
                      <Svg
                        height="100%"
                        width="100%"
                        style={tw`absolute inset-0 rounded-lg`}
                      >
                        <Defs>
                          <LinearGradient
                            id="blueTeamGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                          >
                            <Stop
                              offset="0%"
                              stopColor={redTeam.win ? "#37598C" : "#9B4E4E"}
                              stopOpacity="1"
                            />
                            <Stop
                              offset="38%"
                              stopColor={redTeam.win ? "#27405C" : "#5F4848"}
                              stopOpacity="1"
                            />
                          </LinearGradient>
                        </Defs>
                        <Rect
                          width="100%"
                          height="100%"
                          fill="url(#blueTeamGrad)"
                        />
                      </Svg>
                      <View>
                        <Svg
                          height="100%"
                          width="100%"
                          style={tw`absolute inset-0 rounded-lg`}
                        >
                          <Defs>
                            <LinearGradient
                              id="blueTeamGrad"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                            >
                              <Stop
                                offset="0%"
                                stopColor={redTeam.win ? "#37598C" : "#9B4E4E"}
                                stopOpacity="1"
                              />
                              <Stop
                                offset="38%"
                                stopColor={redTeam.win ? "#27405C" : "#5F4848"}
                                stopOpacity="1"
                              />
                            </LinearGradient>
                          </Defs>
                          <Rect
                            width="100%"
                            height="100%"
                            fill="url(#blueTeamGrad)"
                          />
                        </Svg>
                        <CustomText
                          weight={"Bmedium"}
                          style={tw`mb-2 pl-[6px] text-white`}
                        >
                          Red Side
                        </CustomText>
                      </View>
                    </View>

                    <View style={tw`flex-1`}>
                      <Svg
                        height="100%"
                        width="100%"
                        style={tw`absolute inset-0 rounded-lg`}
                      >
                        <Defs>
                          <LinearGradient
                            id="blueTeamGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                          >
                            <Stop
                              offset="0%"
                              stopColor={redTeam.win ? "#37598C" : "#9B4E4E"}
                              stopOpacity="1"
                            />
                            <Stop
                              offset="38%"
                              stopColor={redTeam.win ? "#27405C" : "#5F4848"}
                              stopOpacity="1"
                            />
                          </LinearGradient>
                        </Defs>
                        <Rect
                          width="100%"
                          height="100%"
                          fill="url(#blueTeamGrad)"
                        />
                      </Svg>
                      {match.info.participants
                        .slice(5, 10)
                        .map((player, idx) => (
                          <View
                            key={idx}
                            style={tw`flex-row mb-2 px-2 gap-2 items-center justify-between ${
                              player.puuid === puuidData.puuid ? "" : ""
                            }`}
                          >
                            <View style={tw`flex-row items-center gap-2`}>
                              <Image
                                source={
                                  player.championName
                                    ? {
                                        uri: `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${player.championName}.png`,
                                      }
                                    : null
                                }
                                style={tw`w-10 h-10 rounded-full`}
                              />
                              <View style={tw`flex items-start`}>
                                <CustomText weight={"M"} style={tw`text-white`}>
                                  {player.summonerName}
                                </CustomText>
                                <View style={tw`flex-row`}>
                                  <CustomText
                                    weight={"Bmedium"}
                                    style={tw`text-white`}
                                  >
                                    {player.kills}/{player.deaths}/
                                    {player.assists}
                                  </CustomText>
                                </View>
                              </View>
                            </View>

                            <View style={tw`flex`}>
                              <View style={tw`flex-row`}>
                                {[...Array(7)].map((_, itemIdx) => (
                                  <Image
                                    key={itemIdx}
                                    source={
                                      player[`item${itemIdx}`]
                                        ? {
                                            uri: getItemImage(
                                              player[`item${itemIdx}`]
                                            ),
                                          }
                                        : null
                                    }
                                    style={tw`w-6 h-6 ${
                                      !player[`item${itemIdx}`]
                                        ? "bg-[#242222]"
                                        : ""
                                    }`}
                                  />
                                ))}
                              </View>
                              <View style={tw`flex-row gap-2 justify-end`}>
                                <CustomText
                                  weight={"Bmedium"}
                                  style={tw`text-white`}
                                >
                                  {player.totalMinionsKilled}&nbsp;CS -&nbsp;
                                  {player.goldEarned}&nbsp;Golds
                                </CustomText>
                              </View>
                            </View>
                          </View>
                        ))}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {loading && (
        <ActivityIndicator size="large" color={colors.card} style={tw`mt-5`} />
      )}

      {error && <CustomText style={tw`mt-5`}>{error}</CustomText>}
    </SafeAreaView>
  );
};

export default SearchScreen;
