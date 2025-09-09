import { configureStore } from '@reduxjs/toolkit';
import userReducer, { setUser, clearUser } from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  }
});

export const selectUser = (state) => state.user.user;

// Re-export actions for convenient import from './store'
export { setUser, clearUser };
