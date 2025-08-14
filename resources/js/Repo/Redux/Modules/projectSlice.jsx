import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload.data;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        addProject: (state, action) => {
            state.projects.push(action.payload);
        },
        updateProject: (state, action) => {
            const index = state.projects.findIndex(project => project.id === action.payload.id);
            if (index !== -1) {
                state.projects[index] = action.payload;
            }
        },
        setCurrentProject: (state, action) => {
            state.currentProject = action.payload;
        }
    }
});

export const {
    setProjects,
    setError,
    setLoading,
    addProject,
    updateProject,
    setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
