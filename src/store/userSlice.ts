// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string[];
  phoneNumber?: string;
  dateJoined?: string; // e.g., "2026-01-19"
  memberType?: string; // e.g., "Premium", "Basic"
  instagram?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  threads?: string;
  status?: string; // e.g., "Online", "Offline"
  isAuthenticated: boolean;
}

const initialState: UserState = {
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload, { isAuthenticated: true });
    },
    clearUser(state) {
      return { ...initialState };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
