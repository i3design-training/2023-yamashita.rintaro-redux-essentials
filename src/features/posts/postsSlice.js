import { createSlice, nanoid } from '@reduxjs/toolkit'

// stateは直接配列ではなく、postsというキーを持つオブジェクト
// posts配列だけでなく、非同期リクエストのstatusとerrorも管理
// 新しい投稿を追加するためには、state.posts.push(action.payload)
const initialState = {
  posts: [],
  status: 'idle',
  error: null,
}

// slice: actionとreducerを同時に作る
// 注意❗️：actionとreducerを同時に作るため、同じ名前が使われる。
// reducersオブジェクト内のpostAddedは、リデューサー関数。
//    postAddedアクションがディスパッチされたときに、Reduxの状態をどのように更新するかを定義する。
// postsSlice.actions.postAddedは、アクションクリエーター関数。postAddedアクションオブジェクトを生成。
//    このアクションオブジェクトは、typeプロパティとpayloadプロパティを持ち、それぞれアクションの種類とアクションのペイロード（データ）を表します。

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
        state.posts.push(action.payload)
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
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        // 投稿のreactionsオブジェクト内の対応するリアクションの数を1つ増やす
        existingPost.reactions[reaction]++
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      // const existingPost = state.posts.find((post) => post.id === postId)では？
      const existingPost = state.posts.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
})

// アクションクリエーター関数。
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = (state) => state.posts.posts

export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId)
