import React, { memo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import Icon1 from "react-native-vector-icons/Feather";
import Icon2 from "react-native-vector-icons/MaterialIcons";

import { TTodo } from "../../types";

type Props = {
  todo: TTodo;
  onPress: (order: TTodo["order"]) => void;
};

export default memo(function TodoItem({ todo, onPress }: Props) {
  const { title, order, done } = todo;

  return (
    <TouchableOpacity onPress={() => onPress(order)}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{title}</ListItem.Title>
        </ListItem.Content>
        {done ? <Icon2 name="done" /> : null}
      </ListItem>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  todoItem: {
    fontSize: 20,
  },
});
