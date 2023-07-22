import { formatDistanceToNow, parseISO } from 'date-fns'
import React from 'react'

export const TimeAgo = ({ timestamp }) => {
  let timeAgo = ''
  if (timestamp) {
    // JavaScriptのDateオブジェクトに変換
    const date = parseISO(timestamp)
    // 日付が現在からどれくらい前のものであるかを計算
    const timePeriod = formatDistanceToNow(date)
    timeAgo = `${timePeriod} ago`
  }

  return (
    // マウスオーバー時に元のタイムスタンプを表示
    <span title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </span>
  )
}
