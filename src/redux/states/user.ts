import { createSlice } from '@reduxjs/toolkit';
import { UserInfo } from '../../models';
// import { clearLocalStorage, persistLocalStorage } from '../../utilities';

export const EmptyUserState: UserInfo = {
  id: '',
  name: '',
  username: ''
};

export const UserKey = 'user';

export const userSlice = createSlice({
  name: 'user',
  initialState: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : EmptyUserState,
  reducers: {
    createUser: (_state, action) => {
      // persistLocalStorage<UserInfo>(UserKey, action.payload);
      return action.payload;
    },
    updateUser: (state, action) => {
      const result = { ...state, ...action.payload };
      // persistLocalStorage<UserInfo>(UserKey, result);
      return result;
    },
    resetUser: () => {
      // clearLocalStorage(UserKey);
      return EmptyUserState;
    }
  }
});

export const { createUser, updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;