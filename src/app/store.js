import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import scannerReducer from '../features/scanner/scannerSlice';
import profileReducer from '../features/profile/profileSlice';
import homeReducer from '../features/home/homeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        scanner: scannerReducer,
        profile: profileReducer,
        home: homeReducer
    },
});