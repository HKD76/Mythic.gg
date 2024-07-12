import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import apiClient from "../api/apiClient";
import UsernameTagInput from "../components/UsernameTagInput";
import { useTheme as useNavTheme } from "@react-navigation/native";
import Dropdown from "../components/Dropdown";
import tw from "twrnc";
import CustomText from "../components/CustomText";

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

  const { colors } = useNavTheme();

  const [selectedChampion, setSelectedChampion] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const championOptions = [
    { label: "Aucun choix", value: null },
    // Ajoutez ici les options de champions dynamiquement
  ];

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
    { label: "Mid", value: "MID" },
    { label: "ADC", value: "ADC" },
    { label: "Support", value: "SUPPORT" },
  ];

  useEffect(() => {
    // Fetch champion data from API and populate championOptions
    const fetchChampions = async () => {
      try {
        const response = await apiClient.get(
          `https://ddragon.leagueoflegends.com/cdn/14.12.1/data/en_US/champion.json`
        );
        const championsData = response.data.data;
        const options = Object.values(championsData).map((champion) => ({
          label: champion.name,
          value: champion.id,
        }));
        setChampionOptions([{ label: "Aucun choix", value: null }, ...options]);
      } catch (error) {
        console.error("Error fetching champions:", error);
      }
    };

    fetchChampions();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    setProfileData(null);
    setPuuidData(null);
    setRankedStats(null);
    setRecentMatches(null);

    try {
      const puuidResponse = await apiClient.get(`/account/${username}/${tag}`);
      const puuidData = puuidResponse.data;
      setPuuidData(puuidData);

      const profileResponse = await apiClient.get(
        `/account-puuid/${puuidData.puuid}`
      );
      const profileData = profileResponse.data;
      setProfileData(profileData);

      const rankedStatsResponse = await apiClient.get(
        `/ranked-stats/${puuidData.id}`
      );
      const rankedStatsData = rankedStatsResponse.data.filter(
        (entry) => entry.queueType === "RANKED_SOLO_5x5"
      );
      setRankedStats(rankedStatsData);

      const recentMatchesResponse = await apiClient.get(
        `/recent-matches/${puuidData.puuid}`
      );
      setRecentMatches(recentMatchesResponse.data);
      const matchesData = recentMatchesResponse.data;

      if (matchesData && matchesData.length > 0) {
        const lastChampionId = matchesData[0].info.participants.find(
          (p) => p.puuid === puuidData.puuid
        ).championId;

        const championResponse = await apiClient.get(
          `https://ddragon.leagueoflegends.com/cdn/14.12.1/data/en_US/champion.json`
        );
        const championsData = championResponse.data.data;

        const lastChampionName = Object.values(championsData).find(
          (champion) => parseInt(champion.key) === lastChampionId
        ).id;

        const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${lastChampionName}_0.jpg`;
        setLastChampionSplash(splashUrl);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
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

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const profileIconUrl = profileData
    ? `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/profileicon/${profileData.profileIconId}.png`
    : null;

  const getRankImage = (tier) => {
    return rankImages[tier] || null;
  };

  const getItemImage = (itemId) => {
    return itemId
      ? `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/item/${itemId}.png`
      : null;
  };

  const getSummonerSpellImage = (spellId) => {
    return spellId
      ? `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/spell/Summoner${spellId}.png`
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
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${remainingMinutes}m`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
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
          : true;
        const matchesRole = selectedRole ? matchRole === selectedRole : true;

        return matchesChampion && matchesQueue && matchesRole;
      })
    : [];

  return (
    <SafeAreaView style={tw`flex-1 bg-[${colors.background}] gap-[6px]`}>
      <View style={tw`w-full items-center`}>
        <UsernameTagInput
          username={username}
          tag={tag}
          setUsername={setUsername}
          setTag={setTag}
          onSubmitEditing={handleFetchProfile}
        />
      </View>

      {profileData && puuidData && (
        <ImageBackground
          source={{ uri: lastChampionSplash }}
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
                    source={{ uri: profileIconUrl }}
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
                      source={getRankImage(rankedStats[0].tier)}
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
            const matchDate = formatDate(match.info.gameCreation);
            const queueType = match.info.queueId === 420 ? "Ranked" : "Normal";

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
                      y2="0%"
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
                  <Rect width="100%" height="100%" fill="url(#linearGrad)" />
                </Svg>

                <View
                  style={tw`flex-row justify-between items-center border-b-[1px] border-[${
                    isVictory ? "#3682DC" : "#DE2A34"
                  }]`}
                >
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
                </View>

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
                        y2="0%"
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
                    <Rect width="100%" height="100%" fill="url(#linearGrad)" />
                  </Svg>

                  <View style={tw``}>
                    <Image
                      source={{
                        uri: `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/champion/${playerData.championName}.png`,
                      }}
                      style={tw`w-[45px] h-[45px] rounded-[2px]`}
                    />
                    <View style={tw`flex-row`}>
                      <Image
                        source={{
                          uri: getSummonerSpellImage(playerData.summoner1Id),
                        }}
                        style={tw`bg-black w-[15px] h-[15px]`}
                      />
                      <Image
                        source={{
                          uri: getSummonerSpellImage(playerData.summoner2Id),
                        }}
                        style={tw`bg-black w-[15px] h-[15px]`}
                      />
                      <Image
                        source={{
                          uri: getRuneImage(
                            playerData.perks.styles[0].selections[0].perk
                          ),
                        }}
                        style={tw`bg-black w-[15px] h-[15px]`}
                      />
                    </View>
                  </View>

                  <View style={tw`gap-2`}>
                    <View style={tw`flex-row justify-between`}>
                      <View style={tw`flex-1`}>
                        <View style={tw`flex-row`}>
                          <CustomText weight={"Bmedium"} style={tw`text-white`}>
                            {playerData.kills} /&nbsp;
                          </CustomText>
                          <CustomText weight={""} style={tw`text-[#DE2A34]`}>
                            {playerData.deaths}&nbsp;
                          </CustomText>
                          <CustomText weight={"Bmedium"} style={tw`text-white`}>
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
                          <CustomText weight={"Bmedium"} style={tw`text-white`}>
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
                          source={{
                            uri: getItemImage(playerData[`item${itemIdx}`]),
                          }}
                          style={tw`w-[21px] h-[21px] rounded-[5px] ${
                            !playerData[`item${itemIdx}`] ? "bg-[#242222]" : ""
                          }`}
                        />
                      ))}
                      <Image
                        source={{
                          uri: getItemImage(playerData.item6),
                        }}
                        style={tw`w-[21px] h-[21px] rounded-[5px] ${
                          !playerData.item6 ? "bg-black" : ""
                        }`}
                      />
                    </View>
                  </View>

                  <View style={tw`flex-row p-[5px] pr-0`}>
                    <View style={tw`gap-[2px]`}>
                      {match.info.participants
                        .slice(0, 5)
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
                                    y2="0%"
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
                              source={{
                                uri: `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/champion/${player.championName}.png`,
                              }}
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
                                    y2="0%"
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
                              source={{
                                uri: `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/champion/${player.championName}.png`,
                              }}
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

                {expandedMatches[match.info.gameId] && (
                  <View style={tw``}>
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
                          y2="0%"
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
                    <View style={tw`flex`}>
                      <CustomText
                        weight={"Bmedium"}
                        style={tw`mb-2 text-white`}
                      >
                        Team 1
                      </CustomText>
                      <View style={tw`flex-1`}>
                        {match.info.participants
                          .slice(0, 5)
                          .map((player, idx) => (
                            <View
                              key={idx}
                              style={tw`flex-row mb-2 items-center ${
                                player.puuid === puuidData.puuid ? "" : ""
                              }`}
                            >
                              <Image
                                source={{
                                  uri: `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/champion/${player.championName}.png`,
                                }}
                                style={tw`w-10 h-10 rounded-full`}
                              />
                              <View style={tw`ml-2`}>
                                <CustomText weight={"M"} style={tw`text-white`}>
                                  {player.championName}
                                </CustomText>
                                <View style={tw`flex-row`}>
                                  {[...Array(7)].map((_, itemIdx) => (
                                    <Image
                                      key={itemIdx}
                                      source={{
                                        uri: getItemImage(
                                          player[`item${itemIdx}`]
                                        ),
                                      }}
                                      style={tw`w-8 h-8 ${
                                        !player[`item${itemIdx}`]
                                          ? "bg-black"
                                          : ""
                                      }`}
                                    />
                                  ))}
                                </View>
                              </View>
                            </View>
                          ))}
                      </View>
                      <CustomText
                        weight={"Bmedium"}
                        style={tw`mb-2 text-white`}
                      >
                        Team 2
                      </CustomText>
                      <View style={tw`flex-1`}>
                        {match.info.participants
                          .slice(5, 10)
                          .map((player, idx) => (
                            <View
                              key={idx}
                              style={tw`flex-row mb-2 items-center ${
                                player.puuid === puuidData.puuid ? "" : ""
                              }`}
                            >
                              <Image
                                source={{
                                  uri: `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/champion/${player.championName}.png`,
                                }}
                                style={tw`w-10 h-10 rounded-full`}
                              />
                              <View style={tw`ml-2`}>
                                <CustomText weight={"M"} style={tw`text-white`}>
                                  {player.championName}
                                </CustomText>
                                <View style={tw`flex-row`}>
                                  {[...Array(7)].map((_, itemIdx) => (
                                    <Image
                                      key={itemIdx}
                                      source={{
                                        uri: getItemImage(
                                          player[`item${itemIdx}`]
                                        ),
                                      }}
                                      style={tw`w-8 h-8 ${
                                        !player[`item${itemIdx}`]
                                          ? "bg-black"
                                          : ""
                                      }`}
                                    />
                                  ))}
                                </View>
                              </View>
                            </View>
                          ))}
                      </View>
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
