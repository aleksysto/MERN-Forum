import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AggregatePostObject } from '../interfaces/ForumPosts'
import axios, { AxiosResponse } from 'axios'
import { Link, Params, useParams } from 'react-router-dom'
import PostListItem from './PostListItem'
import SortSelection from '../SortResults/SortSelection'
import useOrderBy from '../hooks/useOrderBy'


export default function PostList() {
    const [count, setCount] = useState<string>('')
    const { posts, setPosts, order, setOrder } = useOrderBy()
    const { category }: Readonly<Params<string>> = useParams()
    useEffect((): void => {
        axios.get(`http://localhost:3000/api/posts/category/${category}`)
            .then((res: AxiosResponse<{ message: string, posts: AggregatePostObject[] }>) => {
                setPosts(res.data.posts)
                setCount(res.data.message)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])
    useEffect((): void => {
        if (posts)
            setPosts([...posts])
    }, [order])
    return posts ? (
        <>
            <div>
                {count} <Link to={{ pathname: `/posts/${category}/create` }}><button>create post</button></Link>
                <SortSelection setOrder={setOrder} />
                <ul>
                    {
                        posts.map((post: AggregatePostObject, idx: number): JSX.Element => {
                            return <PostListItem post={post} index={idx} key={idx} />
                        })
                    }
                </ul>
            </div>
        </>
    ) : (
        <div>Loading...</div>
    )
}