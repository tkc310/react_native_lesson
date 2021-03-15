import React, { memo } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { TTodo, TtoggleTodo } from "@/types";

type Props = {
  todo: TTodo;
  onPress: TtoggleTodo;
};

export default memo(function TodoItem({ todo, onPress }: Props) {
  const { title, order, done } = todo;

  return (
    <TouchableOpacity onPress={() => onPress(order)}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{title}</ListItem.Title>
        </ListItem.Content>
        {done ? <Icon name="done" /> : null}
      </ListItem>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  todoItem: {
    fontSize: 20,
  },
});
