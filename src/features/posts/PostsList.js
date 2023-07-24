import classnames from 'classnames'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { useGetPostsQuery } from '../api/apiSlice'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'

import { useMemo } from 'react'
import { selectPostById } from './postsSlice'

let PostExcerpt = ({ post }) => {
  const post = useSelector((state) => selectPostById(state, postId))
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

// 生成された各クエリーフックは、以下のようないくつかのフィールドを含む "result "オブジェクトを返す：
//    data: サーバからの実際のレスポンス内容。このフィールドはレスポンスを受け取るまで未定義です。
//    isLoading: このフックが現在サーバーに最初のリクエストを行っているかどうかを示すブール値。(異なるデータをリクエストするためにパラメータが変更された場合、isLoadingはfalseのままであることに注意)。
//    isFetching: このフックが現在サーバーに対して何らかのリクエストを行っているかどうかを示すブール値。
//    isSuccess: フックがリクエストに成功し、キャッシュされたデータが利用可能かどうかを示すブール値。
//    isError: 直近のリクエストにエラーがあったかどうかを示すブール値
//    error: 直列化されたエラーオブジェクト
export const PostsList = () => {
  const {
    // postsが未定義である場合に備えてデフォルトの空の配列を与えておき、常にソート用の配列が存在するように
    data: posts = [],
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    // Sort posts in descending chronological order
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content

  // 非同期処理が進行中で、結果がまだ得られていない状態
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedPosts = sortedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))

    const containerClassname = classnames('posts-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }
  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
