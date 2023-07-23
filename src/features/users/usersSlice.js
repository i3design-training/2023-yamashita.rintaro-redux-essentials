import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const initialState = []

// Redux Thunkとは、Reduxのミドルウェアの一つで、
// アクションクリエーターがオブジェクトではなく関数を返すことを許可
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

export default usersSlice.reducer

export const selectAllUsers = (state) => state.users

export const selectUserById = (state, userId) =>
  state.users.find((user) => user.id === userId)
