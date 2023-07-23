import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { client } from '../../api/client'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  // arg(非同期関数に渡す引数)が必要ないため_に置き換える
  // getStateはRedux Thunkから提供される関数で、現在のReduxストアの状態を取得する
  // 分割代入でthunkAPIオブジェクトから直接getStateメソッドを取り出す
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    allNotificationsRead(state, action) {
      state.forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.push(...action.payload)
      // ユーザーが通知一覧ページに遷移したときに、すべての通知が既読状態（readプロパティがtrue）に
      state.forEach((notification) => {
        notification.isNew = !notification.read
      })
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const selectAllNotifications = (state) => state.notifications
