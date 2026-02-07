import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth";
import complaintReducer from "./slice/complaint";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaint: complaintReducer,
  },
});

export default store;
