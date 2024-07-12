import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import CustomText from "../components/CustomText";
import tw from "twrnc";
import { useTheme as useNavTheme } from "@react-navigation/native";

const Dropdown = ({ isOpen, toggleDropdown, label, options, onSelect }) => {
  const { colors } = useNavTheme();

  return (
    <View style={tw`w-[32%] relative`}>
      <TouchableOpacity
        style={tw`flex-row items-center justify-center p-[8px] bg-[${colors.globalred}] rounded-[8px]`}
        onPress={toggleDropdown}
      >
        <CustomText
          weight="heavy"
          style={tw`text-[10px] text-[${colors.buttonText}] mr-1`}
        >
          {label}
        </CustomText>
        <View
          style={tw`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-[${colors.buttonText}]`}
        />
      </TouchableOpacity>
      {isOpen && (
        <ScrollView
          style={tw`absolute top-full w-full bg-[${colors.card}] rounded-[8px] z-10 max-h-[200px]`}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelect(option.value)}
              style={tw`p-[8px] rounded-[8px] m-2 bg-[${colors.globalred}]`}
            >
              <CustomText
                weight="heavy"
                style={tw`text-[15px] text-[${colors.buttonText}]`}
              >
                {option.label}
              </CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Dropdown;
