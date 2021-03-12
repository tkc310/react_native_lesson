import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  flex?: number;
};

const defaultProps = {
  flex: 1,
};

export const CalcButton = ({ label, flex, onPress }: Props) => {
  return (
    <TouchableOpacity style={[styles.button, { flex }]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

CalcButton.defaultProps = defaultProps;
export default CalcButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#b0c4de",
  },
  label: {
    fontSize: 20,
  },
});
