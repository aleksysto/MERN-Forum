import React, { useState } from 'react'
import AccountData from './AccountData'
import AccountEditNav from './AccountEditNav'

export default function AccountPage(): JSX.Element {
    const [edited, setEdited] = useState<boolean>(false)
    return (
        <>

            <div>
                <h1>Account</h1>
                {edited ? <div>Changes saved</div> : null}
            </div>
            <div>
                <AccountEditNav setEdited={setEdited} />
                <AccountData />
            </div>
        </>
    )
}