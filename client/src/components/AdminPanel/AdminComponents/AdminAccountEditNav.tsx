import React, { SetStateAction, useState } from 'react'
import AdminEditLogin from './AdminEditLogin'
import AdminEditProfilePicture from './AdminEditProfilePicture'
import { UserObject } from '../../interfaces/UserObjectContext'
import { AdminAccountEditNavProps } from '../../interfaces/AdminReducerTypes'
export default function AdminAccountEditNav({ user, setEdited, dispatch }: AdminAccountEditNavProps): JSX.Element {
    const [form, setForm] = useState<null | JSX.Element>(null)
    return (
        <>
            <div>
                <button onClick={() => setForm(<AdminEditLogin user={user} setForm={setForm} setEdited={setEdited} dispatch={dispatch} />)}>
                    Change login
                </button>
                <button onClick={() => setForm(<AdminEditProfilePicture user={user} setForm={setForm} setEdited={setEdited} dispatch={dispatch} />)}>
                    Change profile picture
                </button>
            </div>
            {form ? form : null}
        </>
    )
}