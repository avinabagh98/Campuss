import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import scannerReducer from '../features/scanner/scannerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        scanner: scannerReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;