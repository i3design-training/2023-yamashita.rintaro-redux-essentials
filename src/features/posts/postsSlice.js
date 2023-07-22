import { createSlice, nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

const initialState = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
  },
]

// slice: actionとreducerを同時に作る
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // state：現在のReduxストアの状態。この場合、stateは投稿のリストを表す配列
    // action：ディスパッチされたアクション。このアクションはpayloadプロパティを持つべきで、新しく追加される投稿
    //    type：アクションの種類を示す文字列です。これにより、リデューサーはアクションの種類に基づいて状態の更新方法を決定する
    //    payload：アクションオブジェクトが持つことができる追加のフィールドで、アクションが運ぶデータを含む。リデューサーが新しい状態を生成するために使用する。
    postAdded: {
      // postAddedアクションがディスパッチされたときに実行
      // prepareフィールドを使用してアクションのペイロードをカスタマイズする場合、
      // reducerフィールドを使用してリデューサーを明示的に定義する必要がある
      reducer(state, action) {
        // 新しい投稿（action.payload）を投稿のリスト（state）の末尾に追加する
        // createSlice関数では、Immerというライブラリが内部で使用されている
        // Immerは、状態を直接変更するようなコードを書くことを許可し、その変更を元に新しい状態を生成する。
        // そのため、このコードでは状態を直接変更するような操作（state.push）が許可されている。
        state.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
          },
        }
      },
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      // const existingPost = state.posts.find((post) => post.id === postId)では？
      const existingPost = state.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
})

export const { postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer
