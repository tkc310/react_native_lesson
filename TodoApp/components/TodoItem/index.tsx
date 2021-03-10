import React, { memo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { TTodo } from "../../types";

type Props = {
  todo: TTodo;
  onPress: (order: TTodo["order"]) => void;
};

export default memo(function TodoItem({ todo, onPress }: Props) {
  const { title, order, done } = todo;

  return (
    <TouchableOpacity onPress={() => onPress(order)}>
      <Text style={[styles.todoItem, done ? styles.done : styles.none]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  todoItem: {
    fontSize: 20,
  },
  none: {
    textDecorationLine: "none",
  },
  done: {
    textDecorationLine: "line-through",
  },
});
