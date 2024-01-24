import React, { useState } from 'react'
import AccountData from './AccountData'
import AccountEditNav from './AccountEditNav'

export default function AccountPage(): JSX.Element {
    const [edited, setEdited] = useState<boolean>(false)
    return (
        <>
            <div className="AccountPage">
                <div className="AccountPageHeader">
                    <h1>Account</h1>
                    <AccountEditNav setEdited={setEdited} />
                    {edited ? <div className="AccountPageChangesSaved">Changes saved, refresh the page to see them</div> : null}
                </div>
                <div className="AccountPageData">
                    <AccountData />
                </div>
            </div>
        </>
    )
}