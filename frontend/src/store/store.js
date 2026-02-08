import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth";
import complaintReducer from "./slice/complaint";
import userReducer from "./slice/user";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaint: complaintReducer,
    user: userReducer,
  },
});

export default store;
