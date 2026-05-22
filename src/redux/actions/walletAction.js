import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import { getWallet, updateKegowData, getGroupWallet } from "../../services/walletService";
import {UPDATE_USER } from "../types/authTypes";
import { getSubWallets } from "../../services/walletService";

export const updateUserAction = (updatedFields) => ({
  type: UPDATE_USER,
  payload: updatedFields,
});


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

export const doUpdateKegowData = createAsyncThunk(
  "wallet/doUpdateKegowData",
  async ({groupId, payload}, { dispatch, rejectWithValue }) => {
    try {
      const data = await updateKegowData(groupId, payload);
      // if(data?.status === 'success'){
      //   const currentUser = store.getState().auth.user;
      //   const updatedWallet = { 
      //     ...currentUser.Group['Wallet'], 
      //     ...data?.data 
      //   };
      //   dispatch(updateUserAction({
      //     Group: {
      //       ...currentUser.Group,
      //       Wallet: updatedWallet
      //     }
      //   }));
       
      // }
      // console.log('data', data)
      return data;
    } catch (error) {
      console.log('rejection error', error)
      return rejectWithValue(error.message || "Action failed");
    }
  }
);  


export const doGetGroupWallet = createAsyncThunk(
  "wallet/doGetGroupWallet",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getGroupWallet(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);


export const doGetSubWallets = createAsyncThunk(
  "wallet/doGetSubWallets",
  async (groupId, { rejectWithValue }) => {
    try {
      const data = await getSubWallets(groupId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);


export const useGetSubWallets = () => useDispatcher(doGetSubWallets);
export const useGetWallet = () => useDispatcher(doGetWallet);
export const useUpdateKegowData = () => useDispatcher(doUpdateKegowData);
export const useGetGroupWallet = () => useDispatcher(doGetGroupWallet);
