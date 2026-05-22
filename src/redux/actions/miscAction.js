import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import { getDashboardData, clearDB, deleteUser } from "../../services/miscService";

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

export const doClearDB = createAsyncThunk(
  "misc/doClearDB",
  async (_, { rejectWithValue }) => {
    try {
      const data = await clearDB();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doDeleteUser = createAsyncThunk(
  "misc/doDeleteUser",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await deleteUser(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const useGetDashboardData = () => useDispatcher(doGetDashboardData);

export const useClearDB = () => useDispatcher(doClearDB);

export const useDeleteUser = () => useDispatcher(doDeleteUser);