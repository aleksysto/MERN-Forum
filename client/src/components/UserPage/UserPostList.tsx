import React, { useEffect, useState } from 'react'
import { PostObject } from '../interfaces/ForumPosts'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Link } from 'react-router-dom'

export default function UserPostList({ login }: { login: string }): JSX.Element {
    const [posts, setPosts] = useState<PostObject[] | null>(null)
    const [message, setMessage] = useState<string>('Loading...')
    useEffect(() => {
        axios.get(`http://localhost:4000/api/posts/author/${login}`).then((res: AxiosResponse) => {
            setPosts(res.data.posts)
            setMessage(res.data.message)
        }).catch((error: AxiosError) => {
            setMessage('Server error')
        })
    }, [])
    return posts ? (
        <>
            <ul className="UserPostList">
                <div className="text-2xl text-center">Posts by {login}:</div>
                {posts.map((post: PostObject, idx: number): JSX.Element => {
                    return (
                        <li key={idx}>
                            <div className="UserPostListItem">
                                <Link to={{ pathname: `/posts/post/${post._id}` }}>
                                    <div className="UserPostListTitle">{post.title}</div>
                                    <div className="UserPostListCategory">{post.category}</div>
                                </Link>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </>
    ) :
        (
            <div>{message}</div>
        )
}