import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AggregatePostObject } from '../interfaces/ForumPosts'
import PostListItem from '../PostList/PostListItem'
import useOrderBy from '../hooks/useOrderBy'
import { useOrderByHook } from '../interfaces/useOrderByTypes'
import SortSelection from '../SortResults/SortSelection'

export default function SearchResultsPage() {
    const [searchParams] = useSearchParams()
    const field: null | string = searchParams.get('field')
    const q: null | string = searchParams.get('q')
    const category: null | string = searchParams.get('category')
    const keywords: null | string = searchParams.get('keywords')
    const [message, setMessage] = useState<string>('loading...')
    const { order, setOrder, posts, setPosts }: useOrderByHook = useOrderBy()

    useEffect(() => {
        if (keywords) {
            axios.get(`http://localhost:4000/api/search?keywords=${keywords}&category=${category}`)
                .then((res: AxiosResponse<{ message: string, posts: AggregatePostObject[] }>): void => {
                    setPosts(res.data.posts)
                    setMessage(res.data.message)
                })
                .catch((err: AxiosError<{ message: string }>): void => {
                    err.response ? setMessage(err.response.data.message) : setMessage("Server error")
                })
        } else {
            axios.get(`http://localhost:4000/api/search?field=${field}&q=${q}&category=${category}`)
                .then((res: AxiosResponse<{ message: string, posts: AggregatePostObject[] }>): void => {
                    setPosts(res.data.posts)
                    setMessage(res.data.message)
                })
                .catch((err: AxiosError<{ message: string }>): void => {
                    err.response ? setMessage(err.response.data.message) : setMessage("Server error")
                })
        }
    }, [])
    useEffect((): void => {

    }, [order])
    return posts === null ? (<>
        <div>{message}</div>
    </>
    ) : (
        <>
            <div>
                <div>
                    <SortSelection setOrder={setOrder} />
                </div>
                <div>{message}, results: </div>
                <div>
                    <ul>
                        {posts.map((post: AggregatePostObject, index: number): JSX.Element => {
                            return <PostListItem post={post} index={index} key={index} />
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}