import React, { useEffect, useRef, useState } from 'react'
import useAdminReducer from '../reducers/AdminReducer'
import { AppAction, AppState } from '../interfaces/AdminReducerTypes'
import { loadPosts } from '../reducers/actions/AdminActions/AdminActions'
import { AggregateCommentObject } from '../interfaces/PostComments'
import CommentPanel from './ListItems/CommentPanel'
import { AggregatePostObject } from '../interfaces/ForumPosts'
import PostPanel from './ListItems/PostPanel'
import { useAdminContext } from '../contexts/AdminContext'
export default function Posts(): JSX.Element {
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const filterRef = useRef<HTMLInputElement>(null)
    function handleFilter(): void {
        if (filterRef.current) {
            dispatch({ type: 'filterPostsTitle', payload: { filter: filterRef.current.value } })
        } else {
            dispatch({ type: 'filterPostsTitle', payload: { filter: undefined } })
        }
    }
    useEffect(() => {
        dispatch({ type: 'setMessage', payload: { message: 'Loading...' } })
        loadPosts().then((res: { message: string, data: AggregatePostObject[] }): void => {
            dispatch({ type: 'setPosts', payload: { message: res.message, posts: res.data } })
        }).catch((err: { message: string }): void => {
            dispatch({ type: 'setMessage', payload: { message: err.message } })
        })
    }, [])
    return (
        <>
            <div>{state.message}</div>
            <div><input ref={filterRef} type="text" id="filter" onChange={handleFilter} /></div>
            <div>
                <ul>
                    {state.displayPosts.map((post: AggregatePostObject, idx: number): JSX.Element => {
                        return (
                            <PostPanel post={post} index={idx} key={post._id} />
                        )
                    })}
                </ul>
            </div>
        </>
    )
}