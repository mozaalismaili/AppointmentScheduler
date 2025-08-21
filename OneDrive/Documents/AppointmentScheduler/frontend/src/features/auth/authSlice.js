import { createSlice } from '@reduxjs/toolkit';

const initialState = { token: null, role: null, name: null, email: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.token = payload.token; state.role = payload.role;
      state.name = payload.name;   state.email = payload.email;
    },
    logout: (s) => { s.token=null; s.role=null; s.name=null; s.email=null; },
  },
});
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
