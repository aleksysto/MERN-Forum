import React, { useEffect, useRef, useState } from 'react'
import useAdminReducer from '../reducers/AdminReducer'
import { AppAction, AppState } from '../interfaces/AdminReducerTypes'
import { loadComments } from '../reducers/actions/AdminActions/AdminActions'
import { AggregateCommentObject } from '../interfaces/PostComments'
import CommentPanel from './ListItems/CommentPanel'
import { useAdminContext } from '../contexts/AdminContext'
export default function Comments(): JSX.Element {
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const filterRef = useRef<HTMLInputElement>(null)
    function handleFilter(): void {
        if (filterRef.current) {
            dispatch({ type: 'filterCommentsContent', payload: { filter: filterRef.current.value } })
        } else {
            dispatch({ type: 'filterCommentsContent', payload: { filter: undefined } })
        }
    }
    useEffect(() => {
        dispatch({ type: 'setMessage', payload: { message: 'Loading...' } })
        loadComments().then((res: { message: string, data: AggregateCommentObject[] }): void => {
            dispatch({ type: 'setComments', payload: { message: res.message, comments: res.data } })
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
                    {state.displayComments.map((comment: AggregateCommentObject, idx: number): JSX.Element => {
                        return (
                            <CommentPanel comment={comment} index={idx} key={comment._id} />
                        )
                    })}
                </ul>
            </div>
        </>
    )
}