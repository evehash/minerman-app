import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import minersSlice from "./minersSlice";
import settingsSlice from "./settingsSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["miners", "settings"], // what is persisted
  blacklist: [],
};

const rootReducer = combineReducers({
  miners: minersSlice,
  settings: settingsSlice,
});

type RootReducer = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer<RootReducer>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
