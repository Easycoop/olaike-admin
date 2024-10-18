import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import { getTransactions } from "../../services/transactionService";

export const doGetTransactions = createAsyncThunk(
  "transactions/doGetTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getTransactions();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const useGetTransactions = () => useDispatcher(doGetTransactions);
