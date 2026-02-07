import api from "./api";

export const createComplaint = async (data) => {
  try {
    const response = await api.post("/complaint/create", data);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    throw new Error(errorMessage);
  }
};

export const updateComplaint = async (id, data) => {
  try {
    const response = await api.put(`/complaint/update/${id}`, data);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    throw new Error(errorMessage);
  }
};

export const deleteComplaint = async (id) => {
  try {
    const response = await api.delete(`/complaint/delete/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    throw new Error(errorMessage);
  }
};

export const getUserComplaints = async () => {
  try {
    const response = await api.get("/complaint/user");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    throw new Error(errorMessage);
  }
};

export const getAllComplaints = async (params = {}) => {
  try {
    const response = await api.get("/complaint/all", { params });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    throw new Error(errorMessage);
  }
};

export const getComplaintById = async (id) => {
  try {
    const response = await api.get(`/complaint/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    throw new Error(errorMessage);
  }
};