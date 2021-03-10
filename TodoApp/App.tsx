import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  FlatList,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TTodo } from "./types";
import TodoItem from "./components/TodoItem";

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
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

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.filter}>
        <TextInput
          onChangeText={(text) => setFilterText(text)}
          value={filterText}
          style={styles.inputText}
        />
      </View>
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
        <TextInput
          onChangeText={(text) => setInputText(text)}
          value={inputText}
          style={styles.inputText}
        />
        <Button
          onPress={handleChange}
          title="Add"
          color="#841584"
          style={styles.inputButton}
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
    height: 30,
    flexDirection: "row",
  },
  inputText: {
    flex: 1,
  },
  inputButton: {
    width: 100,
  },
});
