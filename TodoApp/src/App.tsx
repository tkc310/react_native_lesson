import React from "react";
import { Provider } from "react-redux";
import store, { persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import TodoScreen from "@/screens/TodoScreen";

export const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <TodoScreen />
    </PersistGate>
  </Provider>
);

export default App;
