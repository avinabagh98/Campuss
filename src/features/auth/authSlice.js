import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';


const BASE_URL = Config.BASE_URL;
console.log('>>>>>>>BASE_URL>>>>>>', BASE_URL);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/login`, {
                username,
                password,
            });

            const token = response.data.data.access_token;
            await AsyncStorage.setItem('token', token);

            return token;
        } catch (error) {
            console.log('Login error:', error);
            return rejectWithValue('Login Failed');
        }
    }
);

export const loadTokenFromStorage = createAsyncThunk(
    'auth/loadToken',
    async () => {
        const token = await AsyncStorage.getItem('token');
        return token;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        loading: false,
        error: null,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            try {
                AsyncStorage.setItem('token', action.payload);
            } catch (e) {
                /* ignore */
            }
        },
        logout: state => {
            state.token = null;
            AsyncStorage.clear();
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loginUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
            })
            .addCase(loginUser.rejected, state => {
                state.loading = false;
                state.error = 'Invalid Credentials';
            })
            .addCase(loadTokenFromStorage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.token = action.payload;
                }
            });
    },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;