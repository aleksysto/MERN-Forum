import React, { SetStateAction, useState } from 'react'
import EditEmailForm from '../EditAccountForm/EditEmailForm'
import EditLoginForm from '../EditAccountForm/EditLoginForm'
import EditPasswordForm from '../EditAccountForm/EditPasswordForm'
import EditProfilePictureForm from '../EditAccountForm/EditProfilePictureForm'
import DeleteButton from '../utils/DeleteButton'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useUserContext } from '../contexts/UserContext'
import { NavigateFunction, useNavigate } from 'react-router-dom'
export default function AccountEditNav({ setEdited }: { setEdited: React.Dispatch<SetStateAction<boolean>> }): JSX.Element {
    const [form, setForm] = useState<null | JSX.Element>(null)
    const [message, setMessage] = useState<string>('');
    const [action, setAction] = useState<boolean>(false);
    const [confirm, setConfirm] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { userInfo, setLoggedIn } = useUserContext()
    const navigate: NavigateFunction = useNavigate()
    function handleDelete() {
        axios.delete(`http://localhost:4000/api/users/id/${userInfo._id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse) => {
                setMessage('Deleted')
                localStorage.removeItem('token')
                setLoggedIn(false)
                setTimeout(() => {
                    navigate('/')
                }, 1500)
            })
            .catch((err: AxiosError<{ message: string }>) => {
                err.response
                    ? setError(`${err.response.data.message} please refresh the page`)
                    : setError('Server Error')
            })
    }
    return message ? (<div className="text-standard-text text-4xl"> {message} </div>) : (
        <>
            <div className="AccountPageEditNav">

                <button onClick={() => setForm(<EditLoginForm setForm={setForm} setEdited={setEdited} />)}>
                    Change login
                </button>
                <button onClick={() => setForm(<EditEmailForm setForm={setForm} setEdited={setEdited} />)}>
                    Change email
                </button>
                <button onClick={() => setForm(<EditPasswordForm setForm={setForm} setEdited={setEdited} />)}>
                    Change password
                </button>
                <button onClick={() => setForm(<EditProfilePictureForm setForm={setForm} setEdited={setEdited} />)}>
                    Change profile picture
                </button>
                {error ? (<div>{error}</div>) :
                    <DeleteButton action={action} setAction={setAction} confirm={confirm} setConfirm={setConfirm} handleAction={handleDelete} />
                }
            </div>
            <div className="AccountPageEditForm">
                {form ? form : null}
            </div>
        </>
    )
}