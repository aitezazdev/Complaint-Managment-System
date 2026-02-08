import api from "./api";

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch user profile";
    throw errorMessage; // ✅ Throw string, not Error object
  }
};

// Update user profile
export const updateUserProfile = async (userId, formData) => {
  try {
    // The api interceptor will handle auth token and Content-Type for FormData
    const response = await api.put(`/users/${userId}`, formData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to update user profile";
    throw errorMessage; // ✅ Throw string, not Error object
  }
};

// Get all users (admin only)
export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get("/users", { params });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch users";
    throw errorMessage; // ✅ Throw string, not Error object
  }
};

// Get user by ID (admin only)
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch user";
    throw errorMessage; // ✅ Throw string, not Error object
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to delete user";
    throw errorMessage; // ✅ Throw string, not Error object
  }
};