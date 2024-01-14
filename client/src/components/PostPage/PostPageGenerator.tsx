import React, { useEffect, useState } from 'react'
import { Params, useParams } from 'react-router-dom'
import { PostObject } from '../interfaces/ForumPosts'
import axios, { AxiosError, AxiosResponse } from 'axios'
import DateCreator from '../DateCreator/DateCreator'

export default function PostPage({ setError }: { setError: React.Dispatch<React.SetStateAction<string | null>> }): JSX.Element {
    const { id }: Readonly<Params<string>> = useParams()
    const [post, setPost] = useState<PostObject | null>(null)

    useEffect((): void => {
        axios.get(`http://localhost:4000/api/posts/id/${id}`)
            .then((res: AxiosResponse<{ message: string, post: PostObject }>): void => {
                setPost(res.data.post)
            })
            .catch((err: AxiosError): void => {
                setError('Post not found')
                console.log(err, id)
            })
    })
    return post ? (
        <>
            <div><div>{post.author}</div><div><DateCreator date={post.date} /></div></div>
            <h2>{post.title}</h2>
            <div><div dangerouslySetInnerHTML={{ __html: post.content }}></div></div>
        </>
    ) : (
        <div>Loading...</div>
    )
}