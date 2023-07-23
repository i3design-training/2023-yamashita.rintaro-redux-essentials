import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'
import {
  fetchPosts,
  selectAllPosts,
  selectPostById,
  selectPostIds,
} from './postsSlice'

let PostExcerpt = ({ postId }) => {
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

export const PostsList = () => {
  const dispatch = useDispatch()
  const orderedPostIds = useSelector(selectPostIds)

  //ストアの全状態を引数として受け取り、その中から必要なデータを選択する関数を引数として受け取る
  const posts = useSelector(selectAllPosts)

  const postStatus = useSelector((state) => state.posts.status)
  const error = useSelector((state) => state.posts.error)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
    // dispatchが変更されることはほぼないが、
    // 内部で使用されるすべての外部変数や関数を依存配列に含めるべき、という
    // Reactのベストプラクティスに従い、潜在的なバグや問題を防ぐ
  }, [postStatus, dispatch])

  let content

  // 非同期処理が進行中で、結果がまだ得られていない状態
  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
