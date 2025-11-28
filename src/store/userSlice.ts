// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string[];
  phoneNumber?: string;
  // add any other fields you returned from authorize()
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
      // reset to initial state
      return { ...initialState };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
