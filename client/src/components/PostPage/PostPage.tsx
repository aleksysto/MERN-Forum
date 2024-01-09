import React, { useEffect, useState } from 'react'
import { Params, useParams } from 'react-router-dom'
import { PostObject } from '../interfaces/ForumPosts'
import axios, { AxiosError, AxiosResponse } from 'axios'
import PostPageGenerator from './PostPageGenerator'

export default function PostPage(): JSX.Element {
    const [error, setError] = useState<string | null>(null)

    return error ? (
        <>
            <div>{error}</div>
        </>
    ) : (
        <PostPageGenerator setError={setError} />
    )
}