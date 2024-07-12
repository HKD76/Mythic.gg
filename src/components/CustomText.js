import React from "react";
import { Text } from "react-native";
import { useTheme as useNavTheme } from "@react-navigation/native";
import tw from "twrnc";

const CustomText = ({ style, weight, children, ...props }) => {
  const { colors } = useNavTheme();

  const fontFamily = getFontFamily(weight);
  return (
    <Text style={[tw`text-[${colors.text}]`, style, { fontFamily }]} {...props}>
      {children}
    </Text>
  );
};

const getFontFamily = (weight) => {
  switch (weight) {
    case "Blight":
      return "BeaufortForLoL-Light";
    case "Bregular":
      return "BeaufortForLoL-Regular";
    case "Bmedium":
      return "BeaufortForLoL-Medium";
    case "Bbold":
      return "BeaufortForLoL-Bold";
    case "Bheavy":
      return "BeaufortForLoL-Heavy";
    case "Sregular":
      return "Spiegel_TT_Regular";
    case "M":
      return "Montserrat";
    case "Ssemibold":
      return "Spiegel_TT_SemiBold";
    case "Sbold":
      return "Spiegel_TT_Bold";
    default:
      return "BeaufortForLoL-Heavy";
  }
};

export default CustomText;
