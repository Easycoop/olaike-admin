import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatcher } from "../../utils/useDispatcher";
import {getKycSubmissions, updateKycStatus} from "../../services/kycService";

export const doGetKycSubmissions = createAsyncThunk(
  "kyc/doGetKycSubmissions",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await getKycSubmissions(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doUpdateKycStatus = createAsyncThunk(
  "kyc/doUpdateKycStatus",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateKycStatus(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const useGetKycSubmissions = () => useDispatcher(doGetKycSubmissions);
export const useUpdateKycStatus = () => useDispatcher(doUpdateKycStatus);