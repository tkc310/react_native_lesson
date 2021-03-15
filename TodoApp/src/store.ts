import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducers from "@/reducers";

const persistConfig = {
  key: "TODO",
  storage,
  whitelist: ["todo"]
};

const persisitedReducer = persistReducer(persistConfig, reducers);
const store = createStore(persisitedReducer);

export const persistor = persistStore(store);
export default store;
