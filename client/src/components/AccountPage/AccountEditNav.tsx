import React, { SetStateAction, useState } from 'react'
import EditEmailForm from '../EditAccountForm/EditEmailForm'
import EditLoginForm from '../EditAccountForm/EditLoginForm'
import EditPasswordForm from '../EditAccountForm/EditPasswordForm'
import EditProfilePictureForm from '../EditAccountForm/EditProfilePictureForm'
export default function AccountEditNav({ setEdited }: { setEdited: React.Dispatch<SetStateAction<boolean>> }): JSX.Element {
    const [form, setForm] = useState<null | JSX.Element>(null)
    return (
        <>
            <div>
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
            </div>
            {form ? form : null}
        </>
    )
}