import { useSelector } from 'react-redux'

export const PostsList = () => {
  //ストアの全状態を引数として受け取り、その中から必要なデータを選択する関数を引数として受け取る
  const posts = useSelector((state) => state.posts)

  const renderedPosts = posts.map((post) => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
    </article>
  ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
