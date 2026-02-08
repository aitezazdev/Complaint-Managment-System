import api from "./api";

export const login = async (data) => {
    try {
    const response = await api.post("/auth/login", data);
    return response.data;
    } catch (error) {
    throw error;
    }
}

export const register = async (data) => {
    try {
    const response = await api.post("/auth/register", data);
    console.log(response.data);
    
    return response.data;
    }catch (error) {
    throw error;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await api.get("/auth/getAllUsers");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/auth/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUserById = async (id) => {
    try {
        const response = await api.get(`/auth/getUser/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}