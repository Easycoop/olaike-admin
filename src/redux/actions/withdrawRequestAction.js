import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import {
  getRequests,
  getSingleRequest,
  updateRequest,
} from "../../services/withdrawRequestService";

export const doGetRequests = createAsyncThunk(
  "applications/doGetRequests",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getRequests();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetSingleRequest = createAsyncThunk(
  "applications/doGetSingleRquest",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getSingleRequest(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doUpdateRequest = createAsyncThunk(
  "applications/doUpdateRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateRequest(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const useGetRequests = () => useDispatcher(doGetRequests);
export const useGetSingleRequest = () => useDispatcher(doGetSingleRequest);
export const useUpdateRequest = () => useDispatcher(doUpdateRequest);
