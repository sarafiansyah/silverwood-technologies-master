import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ThemeState {
    isDark: boolean;
}

const initialState: ThemeState = {
    isDark: false, // default light mode
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setDarkMode(state, action: PayloadAction<boolean>) {
            state.isDark = action.payload;
        },
        toggleDarkMode(state) {
            state.isDark = !state.isDark;
        },
    },
});

export const { setDarkMode, toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
