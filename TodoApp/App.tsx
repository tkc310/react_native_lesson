import React, { useState, useCallback, useEffect, useMemo } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ifIphoneX, getStatusBarHeight } from "react-native-iphone-x-helper";

import { TTodo } from "./types";
import TodoItem from "./components/TodoItem";

const STATUSBAR_HEIGHT = getStatusBarHeight();
const STORE_KEY = "@todoapp.todo" as const;

export default function App() {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [inputText, setInputText] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");

  const loadTodo = useCallback(async () => {
    try {
      const todoString = await AsyncStorage.getItem(STORE_KEY);
      if (todoString) {
        const storedTodos = JSON.parse(todoString) || [];
        setTodos(storedTodos);
        setCurrent(storedTodos.length);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const saveTodos = useCallback(async (_todos) => {
    try {
      const todoString = JSON.stringify(_todos);
      await AsyncStorage.setItem(STORE_KEY, todoString);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadTodo();
  }, []);

  const handleChange = useCallback(() => {
    if (inputText === "") return;

    const order = current + 1;
    const newTodo = { order, title: inputText, done: false };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    setCurrent(order);
    setInputText("");
    saveTodos(newTodos);
  }, [inputText, current, todos]);

  const handleToggle = useCallback(
    (order) => {
      const _todos = todos.map((item) => {
        if (item.order === order) {
          return { ...item, done: !item.done };
        } else {
          return item;
        }
      });
      setTodos(_todos);
      saveTodos(_todos);
    },
    [todos]
  );

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
}

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
