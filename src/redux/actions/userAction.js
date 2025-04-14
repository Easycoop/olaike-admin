import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import {
  assignRole,
  createUsers,
  getUser,
  getUsers,
  updateUser,
} from "../../services/userServices";

export const doGetUsers = createAsyncThunk(
  "users/doGetUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUsers();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetUser = createAsyncThunk(
  "users/doGetUser",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getUser(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doUpdateUser = createAsyncThunk(
  "users/doGetUser",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateUser(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doCreateUsers = createAsyncThunk(
  "users/doCreateUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createUsers(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doAssignRole = createAsyncThunk(
  "users/doCreateUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await assignRole(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const useGetUsers = () => useDispatcher(doGetUsers);
export const useGetUser = () => useDispatcher(doGetUser);
export const useUpdateUser = () => useDispatcher(doUpdateUser);
export const useCreateUsers = () => useDispatcher(doCreateUsers);
export const useAssignRole = () => useDispatcher(doAssignRole);
