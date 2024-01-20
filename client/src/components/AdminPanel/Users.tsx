import React, { useEffect, useRef, useState } from 'react'
import useAdminReducer from '../reducers/AdminReducer'
import { AppAction, AppState, OrderDirection } from '../interfaces/AdminReducerTypes'
import { loadUsers } from '../reducers/actions/AdminActions/AdminActions'
import { AggregatePostObject } from '../interfaces/ForumPosts'
import PostPanel from './ListItems/PostPanel'
import { UserObject } from '../interfaces/UserObjectContext'
import UserPanel from './ListItems/UserPanel'
import { useAdminContext } from '../contexts/AdminContext'
export default function Users(): JSX.Element {
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const filterRef = useRef<HTMLInputElement>(null)
    function handleFilter(): void {
        if (filterRef.current) {
            dispatch({ type: 'filterUsersLogin', payload: { filter: filterRef.current.value } })
        } else {
            dispatch({ type: 'filterUsersLogin', payload: { filter: undefined } })
        }
    }
    // login lastactive
    function handleSort(e: React.ChangeEvent<HTMLSelectElement>): void {
        e.preventDefault()
        const order: OrderDirection = e.target.value.split(' ')[0] as OrderDirection
        const orderBy: string = e.target.value.split(' ')[1]
        dispatch({ type: 'sortUsers', payload: { order: order, orderBy: orderBy } })
    }
    useEffect(() => {
        dispatch({ type: 'setMessage', payload: { message: 'Loading...' } })
        loadUsers().then((res: { message: string, data: UserObject[] }): void => {
            dispatch({ type: 'setUsers', payload: { message: res.message, users: res.data } })
        }).catch((err: { message: string }): void => {
            dispatch({ type: 'setMessage', payload: { message: err.message } })
        })
    }, [])

    return (
        <>
            <div>{state.message}</div>
            <div>
                <label htmlFor="filter">Search by login: </label>
                <input ref={filterRef} type="text" id="filter" onChange={handleFilter} />
                <select onChange={handleSort}>
                    <option value="">-Sort-</option>
                    <option value="asc lastActive" >Last Active &uarr;</option>
                    <option value="desc lastActive">Last Active &darr;</option>
                    <option value="desc login" >Login &uarr;</option>
                    <option value="asc login">Login &darr;</option>
                </select>
            </div>
            <div>
                <ul>
                    {state.displayUsers.map((user: UserObject, idx: number): JSX.Element => {
                        return (
                            <UserPanel user={user} index={idx} key={user._id} />
                        )
                    })}
                </ul>
            </div>
        </>
    )
}