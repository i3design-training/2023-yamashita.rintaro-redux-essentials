// RTK Queryは、Redux Toolkitの一部で、APIリクエストを効率的に行うためのツール
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Tips💡
// アプリケーションには1つのcreateApi呼び出ししかないことが期待される。
// この1つのAPIスライスは、同じベースURLと会話するすべてのエンドポイント定義を含むべき
// 例）エンドポイント/api/postsと/api/usersはどちらも同じサーバーからデータをフェッチするので、同じAPIスライスに入る

// createApi: 単一のAPIスライスオブジェクトを定義
//    APIに関連するアクションとリデューサーを自動的に生成
//    この関数にはオブジェクトを渡す。以下のプロパティが含まれる：
//        reducerPath: 生成されたAPIスライスがReduxストアのどの部分に追加されるべきかを示す。この例では、'api'というパスを指定
//        baseQuery: APIリクエストの基本となるクエリを定義
//        endpoints: APIのエンドポイント（つまり、APIの特定の操作やリクエスト）を定義。'/posts'というURLに対するクエリリクエストを表す

// キャッシュリデューサー：
//    APIリクエストの結果を一時的に保存（キャッシュ）するためのReduxのリデューサー
//    リデューサーは、Reduxのアクションに応じてアプリケーションの状態を更新する関数
//    キャッシュリデューサーは特にAPIのレスポンスデータをキャッシュとして管理
//    主な目的：同じAPIリクエストが繰り返し行われる場合に、既に取得済みのデータを再利用することでパフォーマンスを向上させる
export const apiSlice = createApi({
  // キャッシュリデューサーは state.api に追加されることを期待（すでにデフォルト - これはオプショナル）
  reducerPath: 'api',

  // すべてのリクエストは '/fakeApi' から始まるURLを持つ
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),

  // タグを使ってクエリと変異の関係を定義し、データの自動再取得を可能に
  // タグは文字列または小さなオブジェクトで、特定のタイプのデータに名前をつけたり、キャッシュの一部を無効可能に
  // キャッシュのタグが無効になると、RTK Queryは自動的にそのタグでマークされたエンドポイントをリフェッチする

  // 'Post'というデータ型に対応する文字列タグ名の配列を宣言
  tagTypes: ['Post'],

  // エンドポイントは、通常、特定のリソースを表す名前と、そのリソースに対する操作（GET、POST、PUT、DELETEなど）を組み合わせたもの
  // デフォルトでは、GET HTTPリクエストを使用
  // { url：'/posts', method: 'POST', body: newPost } のようなオブジェクトを返すことで上書き可能
  endpoints: (builder) => ({
    // getPostsエンドポイントはデータを返す"クエリ"操作
    getPosts: builder.query({
      // リクエストのURLは '/fakeApi/posts'
      query: () => '/posts',
      // そのクエリのデータを記述するタグのセットを列挙
      providesTags: ['Post'],
    }),
    getPost: builder.query({
      // 注意❗️: クエリパラメータは単一の値でなければならない
      // 複数のパラメータを渡す必要がある場合は、複数のフィールドを含むオブジェクトを渡す必要がある（createAsyncThunkと全く同じ)
      query: (postId) => `/posts/${postId}`,
    }),
    //  builder.mutation(): 変異エンドポイントの追加
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      // 変異が実行されるたびに無効にされるタグのセットを列挙
      invalidatesTags: ['Post'],
    }),
  }),
})

// getPostsクエリエンドポイントの自動生成されたフックをエクスポート
// createApi関数によって自動的に生成される
export const { useGetPostsQuery, useGetPostQuery, useAddNewPostMutation } =
  apiSlice
