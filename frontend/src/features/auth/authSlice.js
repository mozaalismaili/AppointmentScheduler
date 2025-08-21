import { createSlice } from '@reduxjs/toolkit';

const initialState = { token: null, role: null, name: null, email: null, id: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.token = payload.token;
      state.role = payload.role;
      state.name = payload.name;
      state.email = payload.email;
      state.id = payload.id;   // ✅ store user ID
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.name = null;
      state.email = null;
      state.id = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
