import React, { useEffect, useState } from 'react'
import { Params, useParams } from 'react-router-dom'
import { PostObject } from '../interfaces/ForumPosts'
import axios, { AxiosError, AxiosResponse } from 'axios'
import PostPageGenerator from './PostPageGenerator'
import CommentList from '../PostComments/CommentList'
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
                    <CommentList />
                </div>
            </div>
            <CommentCreator />
        </>
    )
}