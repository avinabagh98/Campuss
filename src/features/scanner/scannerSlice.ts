import { createSlice } from '@reduxjs/toolkit';

const scannerSlice = createSlice({
    name: 'scanner',
    initialState: {
        lastScanned: null,
    },
    reducers: {
        setScannedData: (state, action) => {
            state.lastScanned = action.payload;
        },
    },
});

export const { setScannedData } = scannerSlice.actions;
export default scannerSlice.reducer;