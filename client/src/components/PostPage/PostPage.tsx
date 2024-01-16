import React, { useEffect, useState } from 'react'
import { Params, useParams } from 'react-router-dom'
import { PostObject } from '../interfaces/ForumPosts'
import axios, { AxiosError, AxiosResponse } from 'axios'
import PostPageGenerator from './PostPageGenerator'
import CommentList from '../PostComments/CommentList'
import commentsStore from '../reducers/stores/store'
import { Provider } from 'react-redux'
import CommentCreator from '../CreateComment/CommentCreator'

export default function PostPage(): JSX.Element {
    const [error, setError] = useState<string | null>(null)
    return error ? (
        <>
            <div>{error}</div>
        </>
    ) : (
        <>
            <div>
                <div>
                    <PostPageGenerator setError={setError} />
                </div>
                <div>
                    <Provider store={commentsStore}>
                        <CommentList />
                    </Provider>
                </div>
            </div>
            <CommentCreator />
        </>
    )
}