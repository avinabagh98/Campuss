import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Config from "react-native-config";

const BASE_URL = Config.BASE_URL;

export const fetchAttendance = createAsyncThunk(
    "home/fetchAttendance",
    async ({ token, date }, { rejectWithValue }) => {
        try {

            const response = await axios.post(
                `${BASE_URL}/api/list-attendance`,
                { date },
                {
                    headers: {
                        "authorization": `Bearer ${token}`,
                        "Content-type": "application/json",
                    },
                }
            ).catch(error => {
                return rejectWithValue(
                    error.response?.data || "Failed to fetch attendance"
                );
            });

            return response.data.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data || "Failed to fetch attendance"
            );
        }
    }
);

const homeSlice = createSlice({
    name: "home",

    initialState: {
        data: null,
        loading: false,
        error: null,
    },

    reducers: {
        AddAttendance: (state, action) => {
            state.data = action.payload;
        },

        updateAttendance: (state, action) => {
            state.data = state.data.map(item =>
                item.id === action.payload.id ? action.payload : item
            );
        },

        clearAttendance: (state, action) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAttendance.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })

            .addCase(fetchAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { AddAttendance, updateAttendance, clearAttendance } = homeSlice.actions;
export default homeSlice.reducer;
