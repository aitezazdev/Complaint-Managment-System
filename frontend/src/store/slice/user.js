import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCurrentUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUser,
} from "../../services/userApi";

const initialState = {
  currentUserProfile: null,
  users: [],
  selectedUser: null,
  loading: false,
  profileLoaded: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchCurrentUserProfile = createAsyncThunk(
  "user/fetchCurrentUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getAllUsers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserById(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await deleteUser(userId);
      return { userId, ...response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    resetUserState: (state) => {
      state.currentUserProfile = null;
      state.users = [];
      state.selectedUser = null;
      state.loading = false;
      state.profileLoaded = false;
      state.error = null;
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserProfile = action.payload;
        state.profileLoaded = true;
      })
      .addCase(fetchCurrentUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profileLoaded = true;
      })

      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserProfile = action.payload;
        
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit || 10,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user._id !== action.payload.userId
        );
        if (state.selectedUser?._id === action.payload.userId) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedUser, resetUserState } =
  userSlice.actions;

export default userSlice.reducer;