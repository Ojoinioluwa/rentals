import { createSlice } from '@reduxjs/toolkit';
import getUserFromStorage from '../../utils/getUserFromStorage';

interface AuthState {
  user: any;
  token: string | null;
  role: 'landlord' | 'tenant' | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logOutAction: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
    },
    setRole: (state, action) => {
      state.role = action.payload.role;
    },
  },
});

// Optional helper to load user
export const loadUserFromStorage = async () => {
  const storedUser = await getUserFromStorage();
  return {
    user: storedUser?.user || null,
    token: storedUser?.token || null,
    role: storedUser?.role || null,
  };
};

export const { loginAction, logOutAction, setRole } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
