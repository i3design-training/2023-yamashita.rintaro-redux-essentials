import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
// createEntityAdapter：エンティティコレクションを管理するための一連のreducer関数とセレクタを提供
//    getInitialState: 初期状態を生成。エンティティのIDをキーとし、エンティティ自体を値とするオブジェクトと、エンティティのIDの配列を含むオブジェクト
//    addOne: 状態に新しいエンティティを追加
//    addMany: 状態に複数の新しいエンティティを追加
//    setAll: 状態を新しいエンティティのコレクションで置き換える
//    removeOne: 状態から特定のエンティティを削除
//    removeMany: 状態から複数のエンティティを削除
//    updateOne: 状態の特定のエンティティを更新
//    updateMany: 状態の複数のエンティティを更新
//    upsertOne: 状態に新しいエンティティを追加または既存のエンティティを更新
//    upsertMany: 状態に複数の新しいエンティティを追加または既存のエンティティを更新

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

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
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  },
})

export default usersSlice.reducer

// ユーザーの状態からデータを選択するためのメモ化されたセレクタをエクスポート
export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => state.users)
