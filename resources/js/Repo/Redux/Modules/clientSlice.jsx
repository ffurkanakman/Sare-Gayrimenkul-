import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    clients: [],
    loading: false,
    error: null
};

const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        setClients: (state, action) => {
            state.clients = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const {
    setClients,
    setError,
    setLoading
} = clientSlice.actions;
export default clientSlice.reducer;
