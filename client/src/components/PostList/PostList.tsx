import React, { useEffect, useState } from 'react'
import { PostObject } from '../interfaces/ForumPosts'
import axios, { AxiosResponse } from 'axios'
import { Link, Params, useParams } from 'react-router-dom'
import PostListItem from './PostListItem'


export default function PostList() {
    const [posts, setPosts] = useState<PostObject[]>([])
    const [count, setCount] = useState<string>('')
    const { category }: Readonly<Params<string>> = useParams()
    useEffect((): void => {
        axios.get(`http://localhost:3000/api/posts/category/${category}`)
            .then((res: AxiosResponse<{ message: string, posts: PostObject[] }>) => {
                setPosts(res.data.posts)
                setCount(res.data.message)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return (
        <>
            <div>
                {count} <Link to={{ pathname: `/posts/${category}/create` }}><button>create post</button></Link>
                <ul>
                    {
                        posts.map((post: PostObject, idx: number): JSX.Element => {
                            return <PostListItem post={post} index={idx} key={idx} />
                        })
                    }
                </ul>
            </div>
        </>
    )
}