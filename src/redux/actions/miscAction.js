import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import { getDashboardData } from "../../services/miscService";

export const doGetDashboardData = createAsyncThunk(
  "misc/doGetDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDashboardData();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const useGetDashboardData = () => useDispatcher(doGetDashboardData);
