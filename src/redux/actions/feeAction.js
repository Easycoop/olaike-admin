import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatcher } from "../../utils/useDispatcher";
import { getFees, createFee, updateFee, deleteFee } from "../../services/feeService";

export const doGetFees = createAsyncThunk(
  "fee/doGetFees",
  async (groupId, { rejectWithValue }) => {
    try {
      const data = await getFees(groupId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch fees");
    }
  }
);

export const doCreateFee = createAsyncThunk(
  "fee/doCreateFee",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createFee(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create fee");
    }
  }
);

export const doUpdateFee = createAsyncThunk(
  "fee/doUpdateFee",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateFee(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update fee");
    }
  }
);

export const doDeleteFee = createAsyncThunk(
  "fee/doDeleteFee",
  async (feeId, { rejectWithValue }) => {
    try {
      const data = await deleteFee(feeId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete fee");
    }
  }
);

// Export custom hooks for the React components
export const useGetFees = () => useDispatcher(doGetFees);
export const useCreateFee = () => useDispatcher(doCreateFee);
export const useUpdateFee = () => useDispatcher(doUpdateFee);
export const useDeleteFee = () => useDispatcher(doDeleteFee);