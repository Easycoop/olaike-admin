import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatcher } from "../../utils/useDispatcher";
import {getAppConfig, updateLoanSettings, getLoanSettings} from "../../services/configService";

export const doAppConfig = createAsyncThunk(
  "config/doGetAppConfig",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await getAppConfig(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doUpdateLoanSettings = createAsyncThunk(
  "config/doUpdateLoanSettings",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateLoanSettings(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetLoanSettings = createAsyncThunk(
  "config/doGetLoanSettings",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await getLoanSettings(payload);
      return data;
    } catch (error) {
      // console.log(error);
      throw error.message || "Action failed"; 
      // rejectWithValue(error.message || "Action failed");
    }
  }
);


export const useGetAppConfig = () => useDispatcher(doAppConfig);
export const useUpdateLoanSettings = () => useDispatcher(doUpdateLoanSettings);
export const useGetLoanSettings = () => useDispatcher(doGetLoanSettings);