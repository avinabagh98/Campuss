import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Config from "react-native-config";

const BASE_URL = Config.BASE_URL;

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (token, { rejectWithValue }) => {
        try {
            console.log("Fetching profile... ", token);

            const response = await axios.get(`${BASE_URL}/api/profile`, {
                headers: {
                    "authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                }
            }).catch(err => {
                console.error("Error fetching profile:", err);
            });

            console.log("profile response", response);

            return response.data.data;

        } catch (error) {
            return rejectWithValue("Failed to fetch profile");
        }
    }
);

const profileSlice = createSlice({
    name: "profile",

    initialState: {
        userId: null,
        name: null,
        username: null,
        email: null,
        phone: null,
        role: null,
        loading: false,
        error: null
    },

    reducers: {
        addProfile: (state, action) => {
            const { id, name, username, email, phone, role } = action.payload;

            state.userId = id;
            state.name = name;
            state.username = username;
            state.email = email;
            state.phone = phone;
            state.role = role;
        }
    },

    extraReducers: builder => {

        builder

            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchProfile.fulfilled, (state, action) => {

                state.loading = false;

                const { userId, name, username, email, phone, role } = action.payload;

                state.userId = userId;
                state.name = name;
                state.username = username;
                state.email = email;
                state.phone = phone;
                state.role = role;
            })

            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    }
});

export const { addProfile } = profileSlice.actions;

export default profileSlice.reducer;