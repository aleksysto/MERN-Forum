import React, { useEffect, useState } from 'react'
import { Params, useParams } from 'react-router-dom'
import { AggregatePostObject } from '../interfaces/ForumPosts'
import axios, { AxiosError, AxiosResponse } from 'axios'
import DateCreator from '../DateCreator/DateCreator'
import { useUserContext } from '../contexts/UserContext'
import { checkAdmin, checkAuthor } from '../utils/CheckPermissions'
import EditPost from '../CreatePost/EditPost'

export default function PostPage({ setError }: { setError: React.Dispatch<React.SetStateAction<string | null>> }): JSX.Element {
    const { id }: Readonly<Params<string>> = useParams()
    const [post, setPost] = useState<AggregatePostObject | null>(null)
    const [editing, setEditing] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    useEffect((): void => {
        axios.get(`http://localhost:4000/api/posts/id/${id}`)
            .then((res: AxiosResponse<{ message: string, post: AggregatePostObject[] }>): void => {
                setPost(res.data.post[0])
            })
            .catch((err: AxiosError): void => {
                setError('Post not found')
                console.log(err, id)
            })
    }, [])
    const { userInfo } = useUserContext()
    return post ? (
        <>
            {editing ? <EditPost setMessage={setMessage} post={post} setEditing={setEditing} /> : (
                <>
                    <div><div>{post.author}</div><div><DateCreator date={post.date} /></div></div>
                    <h2>{post.title}</h2>
                    <div><div dangerouslySetInnerHTML={{ __html: post.content }}></div></div>
                </>
            )}
            {checkAuthor(userInfo, post.author) || checkAdmin(userInfo) ? <button onClick={() => setEditing(!editing)}>edit</button> : null}

        </>
    ) : (
        <div>Loading...</div>
    )
}