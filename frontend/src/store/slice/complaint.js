import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createComplaint,
  updateComplaint,
  deleteComplaint,
  getUserComplaints,
  getAllComplaints,
  getComplaintById,
} from "../../services/complaintApi";

const initialState = {
  complaints: [],
  userComplaints: [],
  currentComplaint: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 1,
  userComplaintsLoaded: false,
};

export const createComplaintAsync = createAsyncThunk(
  "complaint/create",
  async (complaintData, { rejectWithValue }) => {
    try {
      const response = await createComplaint(complaintData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateComplaintAsync = createAsyncThunk(
  "complaint/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateComplaint(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteComplaintAsync = createAsyncThunk(
  "complaint/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteComplaint(id);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserComplaints = createAsyncThunk(
  "complaint/fetchUserComplaints",
  async (_, { rejectWithValue, getState }) => {
    // Check if already loaded
    const { userComplaintsLoaded } = getState().complaint;
    if (userComplaintsLoaded) {
      // Return null to skip the API call
      return { skipFetch: true };
    }
    
    try {
      const response = await getUserComplaints();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllComplaints = createAsyncThunk(
  "complaint/fetchAllComplaints",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await getAllComplaints(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchComplaintById = createAsyncThunk(
  "complaint/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getComplaintById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentComplaint: (state) => {
      state.currentComplaint = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createComplaintAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComplaintAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userComplaints.unshift(action.payload.data);
        state.complaints.unshift(action.payload.data);
      })
      .addCase(createComplaintAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateComplaintAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComplaintAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedComplaint = action.payload.data;

        const userIndex = state.userComplaints.findIndex(
          (c) => c._id === updatedComplaint._id
        );
        if (userIndex !== -1) {
          state.userComplaints[userIndex] = updatedComplaint;
        }

        const allIndex = state.complaints.findIndex(
          (c) => c._id === updatedComplaint._id
        );
        if (allIndex !== -1) {
          state.complaints[allIndex] = updatedComplaint;
        }

        if (state.currentComplaint?._id === updatedComplaint._id) {
          state.currentComplaint = updatedComplaint;
        }
      })
      .addCase(updateComplaintAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteComplaintAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComplaintAsync.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;

        state.userComplaints = state.userComplaints.filter(
          (c) => c._id !== deletedId
        );
        state.complaints = state.complaints.filter((c) => c._id !== deletedId);

        if (state.currentComplaint?._id === deletedId) {
          state.currentComplaint = null;
        }
      })
      .addCase(deleteComplaintAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserComplaints.pending, (state) => {
        // Only set loading if data hasn't been loaded yet
        if (!state.userComplaintsLoaded) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchUserComplaints.fulfilled, (state, action) => {
        state.loading = false;
        // Only update if we actually fetched data (not skipped)
        if (!action.payload.skipFetch) {
          state.userComplaints = action.payload.data;
          state.userComplaintsLoaded = true; // Mark as loaded
        }
      })
      .addCase(fetchUserComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchComplaintById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaintById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentComplaint = action.payload.data;
      })
      .addCase(fetchComplaintById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentComplaint } = complaintSlice.actions;
export default complaintSlice.reducer;