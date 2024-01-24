import React, { useEffect, useState } from 'react'
import { AggregatePostObject } from '../interfaces/ForumPosts'
import axios, { AxiosResponse } from 'axios'
import { Link, Params, useParams } from 'react-router-dom'
import PostListItem from './PostListItem'
import SortSelection from '../SortResults/SortSelection'
import useOrderBy from '../hooks/useOrderBy'
import { useUserContext } from '../contexts/UserContext'

export default function PostList() {
    const [count, setCount] = useState<string>('')
    const { posts, setPosts, order, setOrder } = useOrderBy()
    const { category }: Readonly<Params<string>> = useParams()
    const { loggedIn } = useUserContext()
    useEffect((): void => {
        axios.get(`http://localhost:3000/api/posts/category/${category}`)
            .then((res: AxiosResponse<{ message: string, posts: AggregatePostObject[] }>) => {
                setPosts(res.data.posts)
                setCount(res.data.message)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])// eslint-disable-line react-hooks/exhaustive-deps
    useEffect((): void => {
        if (posts)
            setPosts([...posts])
    }, [order])// eslint-disable-line react-hooks/exhaustive-deps
    return posts ? (
        <>
            <div className="PostList">
                <div className="text-1xl text-standard-text flex flex-row justify-evenly">
                    <div >
                        {count}
                    </div>
                    <div>
                        {loggedIn ? (
                            <Link to={{ pathname: `/posts/${category}/create` }} className="CreatePostLink">
                                <button>create post</button>
                            </Link>
                        ) : null}

                    </div>
                    <div>
                        <SortSelection setOrder={setOrder} />
                    </div>
                </div>
                <ul className="list-none pt-12">
                    {
                        posts.map((post: AggregatePostObject, idx: number): JSX.Element => {
                            return <PostListItem post={post} index={idx} key={idx} />
                        })
                    }
                </ul>
            </div>
        </>
    ) : (
        <div className="PostListLoading text-3xl test-standard-text">Loading...</div>
    )
}