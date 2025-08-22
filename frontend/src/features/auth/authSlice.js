import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('auth');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn("Could not load auth state from localStorage", e);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('auth', serializedState);
  } catch (e) {
    console.warn("Could not save auth state to localStorage", e);
  }
};

const initialState = loadState() || { token: null, role: null, name: null, email: null, userId: null, basic: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.token = payload.token || null;
      state.role = payload.role?.toLowerCase() || null; // Normalize role to lowercase
      state.name = payload.name || null;
      state.email = payload.email || null;
      state.userId = payload.userId || null; // Store userId
      state.basic = payload.basic || null; // Store basic auth string
      saveState(state);
    },
    logout: (s) => {
      s.token = null; s.role = null; s.name = null; s.email = null; s.userId = null; s.basic = null;
      localStorage.removeItem('auth');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
