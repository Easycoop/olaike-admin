import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import {
  getApplications,
  getLoanApplications,
  getSocietyLoanApplications,
  getSingleApplication,
  getSingleLoanApplication,
  updateLoanApplication,
  updateUserApplication,
  getLoanCounts,
} from "../../services/applicationService";

export const doGetApplications = createAsyncThunk(
  "applications/doGetApplications",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getApplications();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetSingleApplication = createAsyncThunk(
  "applications/doGetSingleApplication",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getSingleApplication(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doUpdateUserApplication = createAsyncThunk(
  "applications/doUpdateUserApplication",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateUserApplication(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetLoanApplications = createAsyncThunk(
  "applications/doGetLoanApplications",
  async (status, { rejectWithValue }) => {
    try {
      const data = await getLoanApplications(status);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetSocietyLoanApplications = createAsyncThunk(
  "applications/doGetSocietyLoanApplications",
  async ({ status, groupId }, { rejectWithValue }) => {
    try {
      const data = await getSocietyLoanApplications(status, groupId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetSingleLoanApplication = createAsyncThunk(
  "applications/doGetSingleLoanApplication",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("single loan payload", payload);
      
      const data = await getSingleLoanApplication(payload.applicationId, payload.get_repayment);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doUpdateLoanApplication = createAsyncThunk(
  "applications/doUpdateLoanApplication",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateLoanApplication(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetLoanCounts = createAsyncThunk(
  "applications/doGetLoanCounts",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await getLoanCounts(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const useGetApplications = () => useDispatcher(doGetApplications);
export const useGetSingleApplication = () =>
  useDispatcher(doGetSingleApplication);
export const useUpdateUserApplication = () =>
  useDispatcher(doUpdateUserApplication);
export const useGetLoanApplications = () =>
  useDispatcher(doGetLoanApplications);
export const useGetSocietyLoanApplications = () =>
  useDispatcher(doGetSocietyLoanApplications);
export const useGetSingleLoanApplication = () =>
  useDispatcher(doGetSingleLoanApplication);
export const useUpdateLoanApplication = () =>
  useDispatcher(doUpdateLoanApplication);
export const useGetLoanCounts = () => useDispatcher(doGetLoanCounts);
