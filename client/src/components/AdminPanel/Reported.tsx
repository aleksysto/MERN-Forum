import React, { useEffect, useRef, useState } from 'react'
import useAdminReducer from '../reducers/AdminReducer'
import { AppAction, AppState } from '../interfaces/AdminReducerTypes'
import { loadComments, loadReports } from '../reducers/actions/AdminActions/AdminActions'
import { AggregateCommentObject } from '../interfaces/PostComments'
import CommentPanel from './ListItems/CommentPanel'
import { useAdminContext } from '../contexts/AdminContext'
import { ReportObject } from '../interfaces/Reports'
import UserPanel from './ListItems/UserPanel'
import PostPanel from './ListItems/PostPanel'
import { AggregatePostObject, PostObject } from '../interfaces/ForumPosts'
import { UserObject } from '../interfaces/UserObjectContext'
import ReportedPanel from './ListItems/ReportedPanel'
import { ref } from 'yup'
export default function Comments(): JSX.Element {
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const [refresh, setRefresh] = useState(false)
    function handleFilter(e: React.ChangeEvent<HTMLSelectElement>): void {
        e.preventDefault()
        if (e.target.value) {
            dispatch({ type: 'filterReportsType', payload: { filter: e.target.value } })
        } else {
            dispatch({ type: 'filterReportsType', payload: { filter: undefined } })
        }
    }
    function handleSort(e: React.ChangeEvent<HTMLSelectElement>): void {
        e.preventDefault()
        if (e.target.value === 'asc' || e.target.value === 'desc') {
            dispatch({ type: 'sortReports', payload: { order: e.target.value, orderBy: 'reportedOn' } })
        } else {
            dispatch({ type: 'sortReports', payload: { order: undefined } })
        }
    }
    useEffect(() => {
        dispatch({ type: 'setMessage', payload: { message: 'Loading...' } })
        loadReports().then((res: { message: string, data: ReportObject[] }): void => {
            dispatch({ type: 'setReports', payload: { message: res.message, reports: res.data } })
        }).catch((err: { message: string }): void => {
            dispatch({ type: 'setMessage', payload: { message: err.message } })
        })
    }, [])
    return (
        <>
            <div>{state.message}</div>
            <div>
                <select onChange={handleFilter}>
                    <option value="">-Filter-</option>
                    <option value="user" >Reported users</option>
                    <option value="post">Reported posts</option>
                    <option value="comment">Reported comments</option>
                </select>
                <select onChange={handleSort}>
                    <option value="">-Sort-</option>
                    <option value="asc" >Date &uarr;</option>
                    <option value="desc">Date &darr;</option>
                </select>
            </div>
            <div>
                <ul>
                    {state.displayReports.map((report: ReportObject, idx: number): JSX.Element => {
                        return (
                            <ReportedPanel report={report} index={idx} dispatch={dispatch} />
                        )
                    })}
                </ul>
            </div>
        </>
    )
}