import api from './api.js';

// promote user to admin
export const promoteToAdmin = async (id) => {
    try {
        const response = await api.put(`/admin/promote/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to promote user";
        throw new Error(errorMessage);
    }
};

// demote admin to user
export const demoteFromAdmin = async (id) => {
    try {
        const response = await api.put(`/admin/demote/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to demote user";
        throw new Error(errorMessage);
    }
};