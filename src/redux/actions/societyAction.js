import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import {
  createSociety,
  getSocieties,
  getSociety,
  getSocietyMembers,
  updateSociety,
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

export const useGetSocieties = () => useDispatcher(doGetSocieties);
export const useCreateSociety = () => useDispatcher(doCreateSociety);
export const useUpdateSociety = () => useDispatcher(doUpdateSociety);
export const useGetSociety = () => useDispatcher(doGetSociety);
export const useGetSocietyMembers = () => useDispatcher(doGetSocietyMembers);
