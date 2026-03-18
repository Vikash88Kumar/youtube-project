// import {configureStore} from "@reduxjs/toolkit"
// import authReducer from "./authSlice.js"

// export const store = configureStore({
//     reducer: {
//         auth: authReducer
//     }
// })

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

import {
  persistStore,
  persistReducer
} from "redux-persist";

import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "auth",
  storage
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer
  }
});

export const persistor = persistStore(store);