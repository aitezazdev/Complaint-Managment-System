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