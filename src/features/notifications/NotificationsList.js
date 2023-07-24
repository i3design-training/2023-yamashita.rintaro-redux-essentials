// 動的にCSSクラス名を生成するためのライブラリ
import classnames from 'classnames'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersSlice'
import { selectAllNotifications } from './notificationsSlice'

import { useLayoutEffect } from 'react'
import { allNotificationsRead } from './notificationsSlice'

export const NotificationsList = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)

  // コンポーネントがレンダリングされた後にallNotificationsReadアクションをディスパッチ
  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map((notification) => {
    // ISO 8601形式の日付文字列をJavaScriptのDateオブジェクトに変換
    const date = parseISO(notification.date)
    // 現在からの経過時間を計算
    const timeAgo = formatDistanceToNow(date)
    const user = users.find((user) => user.id === notification.user) || {
      name: 'Unknown User',
    }

    // classnamesライブラリを使って、通知が新しい場合には'new'クラスを追加するCSSクラス名を生成
    const notificationClassname = classnames('notification', {
      new: notification.isNew,
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
