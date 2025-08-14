import {useDispatch, useSelector} from 'react-redux';
import {
    setError,
    setLoading,
    setProjects,
    addProject,
    updateProject as updateProjectAction,
    setCurrentProject
}  from '../../Repo/Redux/Modules/projectSlice.jsx';
import { API_CONFIG } from "../EndPoints";
import { toast } from "react-toastify";
import { apiService } from '../Load';
import { ROUTES } from "../../Libs/Routes/config";

// Helper function to handle 401 errors
const handle401Error = (error) => {
    if (error.response && error.response.status === 401) {
        // Clear token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        window.location.href = ROUTES.AUTH.LOGIN;
        return true;
    }
    return false;
};


export const useProject = () => {
    const dispatch = useDispatch();
    const { projects, currentProject, loading, error } = useSelector(state => state.project);

    const setProject = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.PROJECTS.PROJECTS);

            // Sadece data kısmını dispatch et
            dispatch(setProjects(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));

            // Handle 401 error
            if (handle401Error(error)) {
                return;
            }

            toast.error('Yüklenemedi...')
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const saveProject = async (projectData) => {
        try {
            dispatch(setLoading(true));

            // API endpoint'e veri gönderme işlemi
            const response = await apiService.post(API_CONFIG.ENDPOINTS.PROJECTS.SAVE_PROJECT, projectData);

            // Redux store'a projeyi ekle
            dispatch(addProject(response.data.data || projectData));

            // Return the saved project data
            return response.data.data || projectData;

        } catch (error) {
            dispatch(setError(error.message));

            // Handle 401 error
            if (handle401Error(error)) {
                return;
            }

            toast.error('Proje kaydedilemedi');
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getProjectById = async (id) => {
        try {
            dispatch(setLoading(true));

            // First try to find the project in the local state
            if (projects && projects.length > 0) {
                const project = projects.find(p => p.id === parseInt(id));
                if (project) {
                    dispatch(setCurrentProject(project));
                    return project;
                }
            }

            // If not found locally, fetch from API
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.PROJECTS.PROJECTS}/${id}`);

            // Set the current project in the store
            dispatch(setCurrentProject(response.data.data));

            return response.data.data;
        } catch (error) {
            dispatch(setError(error.message));

            // Handle 401 error
            if (handle401Error(error)) {
                return;
            }

            toast.error('Proje yüklenemedi');
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateProject = async (id, projectData) => {
        try {
            dispatch(setLoading(true));

            // API endpoint'e veri gönderme işlemi
            const response = await apiService.put(`${API_CONFIG.ENDPOINTS.PROJECTS.PROJECTS}/${id}`, projectData);

            // Redux store'da projeyi güncelle
            dispatch(updateProjectAction(response.data.data || projectData));

            // Return the updated project data
            return response.data.data || projectData;
        } catch (error) {
            dispatch(setError(error.message));

            // Handle 401 error
            if (handle401Error(error)) {
                return;
            }

            toast.error('Proje güncellenemedi');
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const approveProject = async (id) => {
        try {
            dispatch(setLoading(true));

            // API endpoint'e veri gönderme işlemi
            const response = await apiService.put(`${API_CONFIG.ENDPOINTS.PROJECTS.PROJECTS}/${id}/approve`, {});

            // Redux store'da projeyi güncelle
            dispatch(updateProjectAction(response.data.data));

            // Return the updated project data
            return response.data.data;
        } catch (error) {
            dispatch(setError(error.message));

            // Handle 401 error
            if (handle401Error(error)) {
                return;
            }

            toast.error('Proje onaylanamadı');
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const rejectProject = async (id) => {
        try {
            dispatch(setLoading(true));

            // API endpoint'e veri gönderme işlemi
            const response = await apiService.put(`${API_CONFIG.ENDPOINTS.PROJECTS.PROJECTS}/${id}/reject`, {});

            // Redux store'da projeyi güncelle
            dispatch(updateProjectAction(response.data.data));

            // Return the updated project data
            return response.data.data;
        } catch (error) {
            dispatch(setError(error.message));

            // Handle 401 error
            if (handle401Error(error)) {
                return;
            }

            toast.error('Proje reddedilemedi');
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const deleteProject = async (id) => {
        try {
            dispatch(setLoading(true));

            // API endpoint'e veri gönderme işlemi
            await apiService.delete(`${API_CONFIG.ENDPOINTS.PROJECTS.PROJECTS}/${id}`);

            // Refresh projects list after deletion
            await setProject();

            return true;
        } catch (error) {
            dispatch(setError(error.message));

            // Handle 401 error
            if (handle401Error(error)) {
                return;
            }

            toast.error('Proje silinemedi');
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        projects,
        currentProject,
        loading,
        error,
        setProjects: setProject,
        saveProject,
        getProjectById,
        updateProject,
        approveProject,
        rejectProject,
        deleteProject
    };
};

export default useProject;
