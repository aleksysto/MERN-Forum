import React, { useState } from 'react'
import EditEmailForm from '../EditAccountForm/EditEmailForm'
import EditLoginForm from '../EditAccountForm/EditLoginForm'
import EditPasswordForm from '../EditAccountForm/EditPasswordForm'
import EditProfilePictureForm from '../EditAccountForm/EditProfilePictureForm'
export default function AccountEditNav(): JSX.Element {
    const [form, setForm] = useState<null | JSX.Element>(null)
    return (
        <>
            <div>
                <button onClick={() => setForm(<EditLoginForm setForm={setForm} />)}>
                    Change login
                </button>
                <button onClick={() => setForm(<EditEmailForm setForm={setForm} />)}>
                    Change email
                </button>
                <button onClick={() => setForm(<EditPasswordForm setForm={setForm} />)}>
                    Change password
                </button>
                <button onClick={() => setForm(<EditProfilePictureForm setForm={setForm} />)}>
                    Change profile picture
                </button>
            </div>
            {form ? form : null}
        </>
    )
}