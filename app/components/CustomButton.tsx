import React from "react";
import { View, Button, StyleSheet } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, disabled }) => {
  return (
    <View
      style={[
        styles.buttonContainer,
        disabled ? styles.disabledContainer : styles.enabledContainer,
      ]}
    >
      <Button
        title={title}
        onPress={onPress}
        disabled={disabled}
        color={disabled ? "#b0b0b0" : "#007BFF"} // Change color based on disabled state
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  enabledContainer: {
    backgroundColor: "#007BFF",
  },
  disabledContainer: {
    backgroundColor: "#e0e0e0",
  },
});

export default CustomButton;
