import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatcher } from "../../utils/useDispatcher";
import {getAppConfig, updateLoanSettings, getLoanSettings, updateUnionSettings, getUnionSettings, updateSystemSettings} from "../../services/configService";

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
  async ({groupId, payload}, {dispatch, rejectWithValue }) => {
    
    try {
      const data = await updateLoanSettings(groupId, payload);
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

export const doUpdateUnionSettings = createAsyncThunk(
  "config/doUpdateUnionSettings",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateUnionSettings(payload);
      return data;
    } catch (error) {
      throw error.message || "Action failed"; 
      // return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetUnionSettings = createAsyncThunk(
  "config/doGetUnionSettings",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await getUnionSettings(payload);
      return data;
    } catch (error) {
      throw error.message || "Action failed"; 
    }
  }
);

export const doUpdateSystemSettings = createAsyncThunk(
  "config/doUpdateSystemSettings",
  async ({groupId, payload}, { rejectWithValue }) => {
    try {
      const data = await updateSystemSettings(groupId, payload);
      return data;
    } catch (error) {
      throw error.message || "Action failed"; 
    }
  }
);


export const useGetAppConfig = () => useDispatcher(doAppConfig);
export const useUpdateLoanSettings = () => useDispatcher(doUpdateLoanSettings);
export const useGetLoanSettings = () => useDispatcher(doGetLoanSettings);
export const useUpdateUnionSettings = () => useDispatcher(doUpdateUnionSettings);
export const useGetUnionSettings = () => useDispatcher(doGetUnionSettings);
export const useUpdateSystemSettings = () => useDispatcher(doUpdateSystemSettings);
