import React, { useState } from 'react'
import AdminEditLogin from './AdminEditLogin'
import AdminEditProfilePicture from './AdminEditProfilePicture'
import { AdminAccountEditNavProps } from '../../interfaces/AdminReducerTypes'
export default function AdminAccountEditNav({ user, setEdited }: AdminAccountEditNavProps): JSX.Element {
    const [form, setForm] = useState<null | JSX.Element>(null)
    return (
        <>
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <button onClick={() => setForm(<AdminEditLogin user={user} setForm={setForm} setEdited={setEdited} />)}>
                        Change login
                    </button>
                    <button onClick={() => setForm(<AdminEditProfilePicture user={user} setForm={setForm} setEdited={setEdited} />)}>
                        Change profile picture
                    </button>

                </div>
                <div>
                    {form ? form : null}
                </div>
            </div>
        </>
    )
}