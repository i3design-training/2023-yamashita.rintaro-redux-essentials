import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' },
]

// slice: actionとreducerを同時に作る
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // state：現在のReduxストアの状態。この場合、stateは投稿のリストを表す配列
    // action：ディスパッチされたアクション。このアクションはpayloadプロパティを持つべきで、新しく追加される投稿
    postAdded(state, action) {
      // 新しい投稿（action.payload）を投稿のリスト（state）の末尾に追加する
      // createSlice関数では、Immerというライブラリが内部で使用されている
      // Immerは、状態を直接変更するようなコードを書くことを許可し、その変更を元に新しい状態を生成する。
      // そのため、このコードでは状態を直接変更するような操作（state.push）が許可されています。
      state.push(action.payload)
    },
  },
})

export const { postAdded } = postsSlice.actions

export default postsSlice.reducer
