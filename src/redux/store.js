import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import thunk from "redux-thunk";

import playerReducer from "./features/playerSlice";
import loadingBarReducer from "./features/loadingBarSlice";
import languagesReducer from "./features/languagesSlice";
import audioQualityReducer from "./features/audioQualitySlice";

const createNoopStorage = () => {
  return {
    getItem(_key) { return Promise.resolve(null); },
    setItem(_key, value) { return Promise.resolve(value); },
    removeItem(_key) { return Promise.resolve(); },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["languages"],
};

const qualityPersistConfig = {
  key: "audioQuality",
  storage,
};

const languagePersistedReducer = persistReducer(persistConfig, languagesReducer);
const qualityPersistedReducer = persistReducer(qualityPersistConfig, audioQualityReducer);

export const store = configureStore({
  reducer: {
    player: playerReducer,
    loadingBar: loadingBarReducer,
    languages: languagePersistedReducer,
    audioQuality: qualityPersistedReducer,
  },
  middleware: [thunk],
});

export const persistor = persistStore(store);
