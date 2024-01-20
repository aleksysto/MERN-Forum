import React, { useEffect, useRef, useState } from 'react'
import useAdminReducer from '../reducers/AdminReducer'
import { AppAction, AppState, OrderDirection } from '../interfaces/AdminReducerTypes'
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
    function handleSort(e: React.ChangeEvent<HTMLSelectElement>): void {
        e.preventDefault()
        const order: OrderDirection = e.target.value.split(' ')[0] as OrderDirection
        const orderBy: string = e.target.value.split(' ')[1]
        dispatch({ type: 'sortPosts', payload: { order: order, orderBy: orderBy } })
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
            <div>
                <label htmlFor="filter">Search by title: </label>
                <input ref={filterRef} type="text" id="filter" onChange={handleFilter} />
                <select onChange={handleSort}>
                    <option value="">-Sort-</option>
                    <option value="asc date" >Date &uarr;</option>
                    <option value="desc date">Date &darr;</option>
                    <option value="desc author" >Author &uarr;</option>
                    <option value="asc author">Author &darr;</option>
                </select>
            </div>
            <div>
                <ul>
                    {state.displayPosts.map((post: AggregatePostObject, idx: number): JSX.Element => {
                        return (
                            <PostPanel post={post} index={idx} dispatch={dispatch} key={post._id} />
                        )
                    })}
                </ul>
            </div>
        </>
    )
}