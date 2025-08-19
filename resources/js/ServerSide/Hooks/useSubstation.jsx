// /ServerSide/Hooks/useSubstation.jsx
import { useState } from "react";
import { apiService } from "../Load";
import { API_CONFIG } from "../Endpoints";
import { toast } from "react-toastify";

// helper: normal objeyi FormData'ya çevir
const toFormData = (obj = {}) => {
    const fd = new FormData();
    Object.entries(obj).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        fd.append(k, v);
    });
    return fd;
};

export const useSubstation = () => {
    const [substations, setSubstations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // LIST
    const fetchSubstations = async () => {
        try {
            setLoading(true);
            const res = await apiService.get(API_CONFIG.ENDPOINTS.SUBSTATION.SUBSTATION);
            // successResponse -> data.data; plain -> data
            const data = res?.data?.data ?? res?.data ?? [];
            setSubstations(Array.isArray(data) ? data : []);
            return data;
        } catch (err) {
            setError(err.message);
            toast.error("Şubeler yüklenemedi");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // CREATE (name, cover_image?)
    const createSubstation = async (payload) => {
        try {
            setLoading(true);

            // payload FormData değilse, otomatik çevir
            const body = payload instanceof FormData ? payload : toFormData(payload);

            const res = await apiService.post(
                API_CONFIG.ENDPOINTS.SUBSTATION.SUBSTATION,
                body,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            toast.success("Şube başarıyla eklendi");
            await fetchSubstations();
            return res?.data?.data ?? res?.data;
        } catch (err) {
            setError(err.message);
            toast.error("Şube eklenemedi");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // DELETE
    const deleteSubstation = async (id) => {
        try {
            setLoading(true);
            await apiService.delete(`${API_CONFIG.ENDPOINTS.SUBSTATION.SUBSTATION}/${id}`);
            toast.success("Şube başarıyla silindi");
            await fetchSubstations();
        } catch (err) {
            setError(err.message);
            toast.error("Şube silinemedi");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // UPDATE (PUT override)
    const updateSubstation = async (id, payload) => {
        try {
            setLoading(true);

            const body =
                payload instanceof FormData ? payload : toFormData(payload);
            // method override
            if (!(body instanceof FormData)) {
                // güvenlik için; normalde yukarıda FormData'ya döndü
            }
            body.append("_method", "PUT");

            const res = await apiService.post(
                `${API_CONFIG.ENDPOINTS.SUBSTATION.SUBSTATION}/${id}?_method=PUT`,
                body,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            toast.success("Şube başarıyla güncellendi");
            await fetchSubstations();
            return res?.data?.data ?? res?.data;
        } catch (err) {
            setError(err.message);
            toast.error("Şube güncellenemedi");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        substations,
        loading,
        error,
        fetchSubstations,
        createSubstation,
        deleteSubstation,
        updateSubstation,
    };
};

export default useSubstation;
