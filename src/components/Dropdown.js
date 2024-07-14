import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import CustomText from "../components/CustomText";
import tw from "twrnc";
import { useTheme as useNavTheme } from "@react-navigation/native";

const Dropdown = ({ isOpen, toggleDropdown, label, options, onSelect }) => {
  const { colors } = useNavTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    onSelect(value);
    setModalVisible(false);
  };

  return (
    <View style={tw`w-[32%] relative`}>
      <TouchableOpacity
        style={tw`flex-row items-center justify-center p-[8px] bg-[${colors.globalred}] rounded-[8px]`}
        onPress={() => setModalVisible(true)}
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
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              tw`absolute top-[50px] w-[80%] bg-[${colors.card}] rounded-[8px]`,
              styles.modalContent,
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  style={tw`p-[8px] bg-[${colors.globalred}] rounded-[8px] m-2`}
                >
                  <CustomText
                    weight="heavy"
                    style={tw`text-[15px] text-[${colors.buttonText}]`}
                  >
                    {item.label}
                  </CustomText>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    maxHeight: "50%",
  },
});

export default Dropdown;
