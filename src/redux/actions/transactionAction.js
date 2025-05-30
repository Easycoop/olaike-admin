import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import {
  getTransactions,
  initializeTransaction,
  verifyTransaction,
  verifyTransactionFund,
} from "../../services/transactionService";

export const doGetTransactions = createAsyncThunk(
  "transactions/doGetTransactions",
  async ({ startDate, endDate, page, size, status, society }, { rejectWithValue }) => {
 
    try {
      const data = await getTransactions({ startDate, endDate, page, size, status, society });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doInitializeTransaction = createAsyncThunk(
  "transaction/doInitializeTransaction",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await initializeTransaction(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doVerifyTransaction = createAsyncThunk(
  "transaction/doVerifyTransaction",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await verifyTransaction(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doVerifyTransactionFund = createAsyncThunk(
  "transaction/doVerifyTransactionFund",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await verifyTransactionFund(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const useGetTransactions = () => useDispatcher(doGetTransactions);
export const useInitializeTransaction = () =>
  useDispatcher(doInitializeTransaction);
export const useVerifyTransaction = () => useDispatcher(doVerifyTransaction);
export const useVerifyTransactionFund = () =>
  useDispatcher(doVerifyTransactionFund);
