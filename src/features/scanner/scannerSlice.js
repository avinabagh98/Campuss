// import { createSlice } from '@reduxjs/toolkit';

// const scannerSlice = createSlice({
//     name: 'scanner',
//     initialState: {
//         lastScanned: null,
//     },
//     reducers: {
//         setScannedData: (state, action) => {
//             state.lastScanned = action.payload;
//             // state.lastScanned.push(action.payload);
//         },
//     },
// });

// export const { setScannedData } = scannerSlice.actions;
// export default scannerSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Config from "react-native-config";
import { logout } from '../auth/authSlice';

const BASE_URL = Config.BASE_URL;

// export const sendAttendance = createAsyncThunk(
//     "scanner/sendAttendance",
//     async ({ id, token }, thunkAPI) => {
//         try {
//             const response = await axios.post(
//                 `${BASE_URL}/api/attendance/${id}`,
//                 {},
//                 {
//                     headers: {
//                         "authorization": `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             ).catch(error => {
//                 console.log("Error sending attendance:", error.message);
//                 console.log("Full sending attendance:", error);

//                 return thunkAPI.rejectWithValue(
//                     error.response?.data || "Failed to send attendance"
//                 );
//             });


//             return response.data;

//         } catch (error) {

//             return thunkAPI.rejectWithValue(
//                 error.response?.data || "API Error"
//             );
//         }
//     }
// );

export const sendAttendance = createAsyncThunk(
    "scanner/sendAttendance",
    async ({ id, token }, thunkAPI) => {
        try {
            console.log("Sending attendance for ID:", id);
            const response = await axios.post(
                `${BASE_URL}/api/attendance/${id}`,
                {},
                {
                    headers: {
                        "authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;

        } catch (error) {

            console.log("Error sending attendance:", error.message);

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: error.message,
                    status: error.response?.status
                }
            );
        }
    }
);

const scannerSlice = createSlice({
    name: 'scanner',

    initialState: {
        lastScanned: null,
        ScanResponse: null,
        loading: false,
        error: null,
    },

    reducers: {

        setScannedData: (state, action) => {
            state.lastScanned = action.payload;
        },

    },

    extraReducers: (builder) => {

        builder

            .addCase(sendAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(sendAttendance.fulfilled, (state, action) => {
                state.loading = false;
                state.ScanResponse = action.payload;

            })

            .addCase(sendAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(logout, (state, action) => {
                state.lastScanned = null;
                state.ScanResponse = null;
                state.loading = false;
                state.error = null;
            });

    },
});

export const { setScannedData } = scannerSlice.actions;
export default scannerSlice.reducer;