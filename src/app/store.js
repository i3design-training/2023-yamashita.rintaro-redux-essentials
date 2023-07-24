import { configureStore } from '@reduxjs/toolkit'

import { apiSlice } from '../features/api/apiSlice'
import notificationReducer from '../features/notifications/notificationsSlice'
import postsReducer from '../features/posts/postsSlice'
import usersReducer from '../features/users/usersSlice'

// APIスライスをReduxストアに接続するためには、以下の2つのステップが必要
// 1. APIスライスのキャッシュリデューサーをステートに追加する:
//      Reduxのストアは、アプリケーションの状態を管理。
//      APIスライスは、APIリクエストとその結果を管理するためのキャッシュリデューサーを生成。
//      このリデューサーをストアのステートに追加することで、APIリクエストの結果をキャッシュとして保存し、再利用可能に。
// 2. APIスライスが生成するカスタムミドルウェアをストアに追加する:
//      APIスライスは、キャッシュの寿命と有効期限を管理するカスタムミドルウェアも生成。
//      このミドルウェアはストアに追加する必要がある。
//      ミドルウェアは、アクションがリデューサーに到達する前に実行される関数で、アクションの処理をカスタマイズ可能。
//      今回の場合、ミドルウェアはキャッシュの管理を担当。

export default configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationReducer,
    // APIスライスをReduxストアに接続
    // APIスライスのキャッシュリデューサをステートに追加
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // APIスライスはカスタムミドルウェアを生成するので、それをストアに追加する必要がある
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
