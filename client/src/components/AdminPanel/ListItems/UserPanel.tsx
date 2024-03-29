import React, { useState } from 'react'
import { AppAction, AppState, UserPanelProps } from '../../interfaces/AdminReducerTypes'
import DateCreator from '../../DateCreator/DateCreator'
import useConfirm from '../../hooks/useConfirm'
import { useConfirmHook } from '../../interfaces/useConfirmTypes'
import axios, { AxiosError, AxiosResponse } from 'axios'
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
        dispatch({ type: 'setMessage', payload: { message: "User removed" } })
        setHandled(true)
    }
    return (action && confirm) || handled ? (
        <>
            <div className="pb-4">
                {state.message}
            </div>
        </>
    )
        : (
            <>
                <li key={index}>
                    <div className="AdminPanelUser">
                        <div><button onClick={handleRemove} className='mb-4'>Remove from list</button></div>
                        <div>{edited ? 'Changes saved' : null}</div>
                        <div>
                            <div className="AdminPanelUserImageContainer"><img className="AdminPanelUserImage" src={`http://localhost:4000/api/getImage/${user.profilePicture}`} alt="" /></div>
                            <div>Login: {user.login}</div>
                            <div>Email: {user.email}</div>
                            <div>Last active: <DateCreator date={user.lastActive} /></div>
                            <div>Created: <DateCreator date={user.entryDate} /></div>
                            <div>Posts: {user.posts}</div>
                            <div>Comments: {user.comments}</div>
                        </div>
                        <div className="flex flex-row">
                            <AdminAccountEditNav user={user} setEdited={setEdited} />
                            <DeleteButton {...{ action, setAction, confirm, setConfirm, handleAction: handleDelete }} />
                        </div>
                    </div>
                </li>
            </>
        )
}