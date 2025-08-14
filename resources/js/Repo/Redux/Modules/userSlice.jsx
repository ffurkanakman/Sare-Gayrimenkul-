import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload.data;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        }
    }
});

export const {
    setUsers,
    setError,
    setLoading,
    setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
