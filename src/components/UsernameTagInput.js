import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { searchUsers } from "../api/account";
import CustomText from "./CustomText";
import CogIcon from "../../assets/images/nav/white-cogwheel.svg";
import ArrowRightIcon from "../../assets/images/nav/right-arrow.svg";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";

const UsernameTagInput = ({
  username,
  tag,
  setUsername,
  setTag,
  onSubmitEditing,
}) => {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (query.length >= 3) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async (query) => {
    try {
      const suggestions = await searchUsers(query);
      console.log("Fetched suggestions: ", suggestions);
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionSelect = (gameName, tagLine) => {
    setUsername(gameName);
    setTag(tagLine);
    setSuggestions([]);
  };

  const handleSubmit = () => {
    setSuggestions([]);
    onSubmitEditing();
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View style={tw`flex-row px-[15px] gap-2 items-center`}>
        <TouchableOpacity
          style={tw`p-[9px] rounded-[13px] bg-[${colors.globalred}]`}
          onPress={() => navigation.navigate("Settings")}
        >
          <CogIcon width={24} height={24} fill={"white"} />
        </TouchableOpacity>
        <View style={[styles.container, { borderColor: colors.border }]}>
          <TextInput
            style={[
              styles.input,
              styles.leftInput,
              { color: colors.text },
              { borderColor: colors.border },
            ]}
            placeholder="Enter Summoner's name"
            placeholderTextColor={colors.placeholder}
            value={username}
            onChangeText={(text) => {
              setQuery(text);
              setUsername(text);
            }}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          <TextInput
            style={[styles.input, styles.rightInput, { color: colors.text }]}
            placeholder="#Tag"
            placeholderTextColor={colors.placeholder}
            value={tag}
            onChangeText={setTag}
            maxLength={4}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
        </View>
        <TouchableOpacity
          style={tw`p-[14px] rounded-[13px] bg-[${colors.globalred}]`}
          onPress={handleSubmit}
        >
          <ArrowRightIcon width={15} height={15} fill={"white"} />
        </TouchableOpacity>
      </View>
      {suggestions.length > 0 && (
        <ScrollView
          style={[
            styles.suggestionsList,
            {
              borderColor: "white",
              backgroundColor: colors.buttonBackground,
            },
          ]}
        >
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item._id}
              onPress={() =>
                handleSuggestionSelect(item.gameName, item.tagLine)
              }
              style={styles.suggestion}
            >
              <CustomText
                style={[styles.suggestionText, { color: "white" }]}
                weight="M"
              >
                {item.gameName} #{item.tagLine}
              </CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    width: "70%",
    zIndex: 1000,
  },
  input: {
    height: 40,
    paddingHorizontal: 8,
    flex: 1,
  },
  leftInput: {
    borderRightWidth: 1,
  },
  rightInput: {
    textTransform: "uppercase",
    flex: 0.3,
  },
  suggestionsList: {
    width: "70%",
    position: "absolute",
    top: 45,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 150,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  suggestion: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  suggestionText: {
    fontSize: 16,
    fontFamily: "BeaufortForLoL-Heavy",
    fontWeight: "700",
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default UsernameTagInput;
