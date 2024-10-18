import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatcher } from "../../utils/useDispatcher";
import { createRole, getRoles } from "../../services/roleService";

export const doCreateRole = createAsyncThunk(
  "role/doCreateRole",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createRole(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const doGetRoles = createAsyncThunk(
  "role/doGetRoles",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getRoles();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

export const useCreateRole = () => useDispatcher(doCreateRole);
export const useGetRoles = () => useDispatcher(doGetRoles);
