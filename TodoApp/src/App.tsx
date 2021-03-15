import React from "react";
import { Provider } from "react-redux";
import store from "@/store";
import TodoScreen from "@/screens/TodoScreen";

export const App = () => (
  <Provider store={store}>
    <TodoScreen />
  </Provider>
);

export default App;
