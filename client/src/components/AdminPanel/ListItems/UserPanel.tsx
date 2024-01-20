import React, { useState } from 'react'
import { AppAction, AppState, UserPanelProps } from '../../interfaces/AdminReducerTypes'
import DateCreator from '../../DateCreator/DateCreator'
import useConfirm from '../../hooks/useConfirm'
import { useConfirmHook } from '../../interfaces/useConfirmTypes'
import { isButtonElement } from 'react-router-dom/dist/dom'
import axios, { AxiosError, AxiosResponse } from 'axios'
import useAdminReducer from '../../reducers/AdminReducer'
import { useAdminContext } from '../../contexts/AdminContext'
import DeleteButton from '../../utils/DeleteButton'
import AdminAccountEditNav from '../AdminComponents/AdminAccountEditNav'
export default function Posts({ user, index }: UserPanelProps): JSX.Element {
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const [edited, setEdited] = useState<boolean>(false)
    const [handled, setHandled] = useState<boolean>(false)
    const { action, confirm, setAction, setConfirm }: useConfirmHook = useConfirm()
    function handleDelete(): void {
        axios.delete(`http://localhost:4000/api/users/id/${user._id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse<{ message: string }>): void => {
                dispatch({ type: 'setMessage', payload: { message: "User deleted" } })
                dispatch({ type: 'removeUser', payload: { id: user._id } })
            })
            .catch((err: AxiosError<{ message: string }>): void => {
                err.response
                    ? dispatch({ type: 'setMessage', payload: { message: err.response.data.message } })
                    : dispatch({ type: 'setMessage', payload: { message: 'Server Error' } })
            })
    }
    function handleRemove(): void {
        dispatch({ type: 'removeUser', payload: { id: user._id } })
        setHandled(true)
    }
    return (action && confirm) || handled ? (
        <>
            <div>
                User handled
            </div>
        </>
    )
        : (
            <>
                <li key={index}>
                    <div><button onClick={handleRemove}>Remove from list</button></div>
                    <div>{edited ? 'Changes saved' : null}</div>
                    <div>
                        <AdminAccountEditNav user={user} setEdited={setEdited} dispatch={dispatch} />
                        <DeleteButton {...{ action, setAction, confirm, setConfirm, handleAction: handleDelete }} />
                    </div>
                    <div>
                        <div><img src={`http://localhost:4000/api/getImage/${user.profilePicture}`} alt="" /></div>
                        <div>Login: {user.login}</div>
                        <div>Email: {user.email}</div>
                        <div>Last active: <DateCreator date={user.lastActive} /></div>
                        <div>Created: <DateCreator date={user.entryDate} /></div>
                        <div>Posts: {user.posts}</div>
                        <div>Comments: {user.comments}</div>
                    </div>
                </li>
            </>
        )
}