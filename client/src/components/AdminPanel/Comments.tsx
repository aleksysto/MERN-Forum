import React, { useEffect, useRef } from 'react'
import { AppAction, AppState, OrderDirection } from '../interfaces/AdminReducerTypes'
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
    // autor date
    function handleSort(e: React.ChangeEvent<HTMLSelectElement>): void {
        e.preventDefault()
        const order: OrderDirection = e.target.value.split(' ')[0] as OrderDirection
        const orderBy: string = e.target.value.split(' ')[1]
        dispatch({ type: 'sortComments', payload: { order: order, orderBy: orderBy } })
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
            <div>
                <label htmlFor="filter">Search by content: </label>
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