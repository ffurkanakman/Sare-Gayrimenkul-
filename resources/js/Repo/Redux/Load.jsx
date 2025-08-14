import projectSlice from "./Modules/projectSlice";
import authSlice from "./Modules/authSlice";
import clientSlice from "./Modules/clientSlice";
import userSlice from "./Modules/userSlice";
import {configureStore} from "@reduxjs/toolkit";
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { combineReducers } from 'redux';

// Redux DevTools için yapılandırma
const devToolsOptions = {
    name: 'FSH Makine Redux Store',
    trace: true
};

// Redux Persist yapılandırması
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'] // Sadece auth state'ini persist et
};

const rootReducer = combineReducers({
    project: projectSlice,
    auth: authSlice,
    client: clientSlice,
    user: userSlice,

    // diğer slice'lar
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
            },
        }),
    // Redux DevTools'u etkinleştir
    devTools: process.env.NODE_ENV !== 'production' ? devToolsOptions : false
});

export const persistor = persistStore(store);

// Redux Provider bileşeni
export const ReduxProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
};
