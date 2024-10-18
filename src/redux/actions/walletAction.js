import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import { getWallet } from "../../services/walletService";

export const doGetWallet = createAsyncThunk(
  "wallet/doGetWallet",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getWallet(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const useGetWallet = () => useDispatcher(doGetWallet);
