import React, { useState, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { addTodo, toggleTodo } from "@/actionCreators";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SearchBar, Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { ifIphoneX, getStatusBarHeight } from "react-native-iphone-x-helper";
import { TTodo, TaddTodo, TtoggleTodo } from "@/types";
import TodoItem from "@/components/TodoItem";

const STATUSBAR_HEIGHT = getStatusBarHeight();

type Props = {
  todos: TTodo[];
  addTodo: TaddTodo;
  toggleTodo: TtoggleTodo;
};

export const TodoScreen = ({ todos, addTodo, toggleTodo }: Props) => {
  const [inputText, setInputText] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");

  const handleChange = useCallback(() => {
    if (inputText === "") return;

    addTodo(inputText);
    setInputText("");
  }, [inputText]);

  const handleToggle = useCallback((order) => {
    toggleTodo(order);
  }, []);

  const filteredTodos = useMemo(() => {
    if ([""].includes(filterText)) {
      return todos;
    } else {
      return todos.filter((item) => item.title.includes(filterText));
    }
  }, [todos, filterText]);

  const platform = Platform.OS == "ios" ? "ios" : "android";

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <SearchBar
        platform={platform}
        onChangeText={(text) => setFilterText(text)}
        onClear={() => setFilterText("")}
        value={filterText}
        placeholder="Type filter text"
      />
      <ScrollView style={styles.todoList}>
        <FlatList
          extraData={filteredTodos}
          data={filteredTodos}
          renderItem={({ item }) => (
            <TodoItem todo={item} onPress={handleToggle} />
          )}
          keyExtractor={(item) => `todo_${item.order}`}
        />
      </ScrollView>
      <View style={styles.input}>
        <Input
          onChangeText={(text) => setInputText(text)}
          value={inputText}
          containerStyle={styles.inputText}
        />
        <Button
          onPress={handleChange}
          buttonStyle={styles.inputButton}
          icon={<Icon name="plus" size={30} color="white" />}
        />
      </View>
      <StatusBar />
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = (state) => {
  const { todos } = state.todo;
  return { todos };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTodo: (title: TTodo["title"]) => dispatch(addTodo(title)),
    toggleTodo: (order: TTodo["order"]) => dispatch(toggleTodo(order)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: STATUSBAR_HEIGHT,
  },
  filter: {
    height: 30,
  },
  todoList: {
    flex: 1,
  },
  input: {
    ...ifIphoneX(
      {
        paddingBottom: 30,
        height: 80,
      },
      {
        height: 50,
      }
    ),
    height: 70,
    flexDirection: "row",
    paddingRight: 10,
  },
  inputText: {
    flex: 1,
    paddingHorizontal: 10,
  },
  inputButton: {
    width: 48,
    height: 48,
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 48,
    backgroundColor: "#ff6347",
  },
});
