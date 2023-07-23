import { configureStore } from '@reduxjs/toolkit'

import notificationReducer from '../features/notifications/notificationsSlice'
import postsReducer from '../features/posts/postsSlice'
import usersReducer from '../features/users/usersSlice'

export default configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationReducer,
  },
})
