import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import {
  createSociety,
  getSocieties,
  getSociety,
  getSocietyMembers,
  updateSociety,
  createContribution,
  getContributions,
  updateContribution,
  getContributionThrifts,
  deleteContribution
} from "../../services/societyService";

export const doCreateSociety = createAsyncThunk(
  "society/doCreateSociety",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createSociety(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetSocieties = createAsyncThunk(
  "society/doGetSocieties",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await getSocieties(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);


export const doUpdateSociety = createAsyncThunk(
  "society/doUpdateSociety",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateSociety(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetSociety = createAsyncThunk(
  "society/doGetSociety",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await getSociety(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetSocietyMembers = createAsyncThunk(
  "society/doGetSocietyMembers",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await getSocietyMembers(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doCreateContribution = createAsyncThunk(
  "society/doCreateContribution",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createContribution(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
)

export const dogetContributions = createAsyncThunk(
  "society/dogetContributions",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await getContributions(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
)

export const doGetContributionThrifts = createAsyncThunk(
  "society/doGetContributionThrifts",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await getContributionThrifts(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
)

export const doUpdateContribution = createAsyncThunk(
  "society/doUpdateContribution",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateContribution(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
)

export const doDeleteContribution = createAsyncThunk(
  "society/doDeleteContribution",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await deleteContribution(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
)

export const useGetSocieties = () => useDispatcher(doGetSocieties);
export const useCreateSociety = () => useDispatcher(doCreateSociety);
export const useUpdateSociety = () => useDispatcher(doUpdateSociety);
export const useGetSociety = () => useDispatcher(doGetSociety);
export const useGetSocietyMembers = () => useDispatcher(doGetSocietyMembers);
export const useCreateContribution = () => useDispatcher(doCreateContribution);
export const useGetContributions = () => useDispatcher(dogetContributions);
export const useUpdateContribution = () => useDispatcher(doUpdateContribution);
export const useGetContributionThrifts = () => useDispatcher(doGetContributionThrifts);
export const useDeleteContribution = () => useDispatcher(doDeleteContribution);
