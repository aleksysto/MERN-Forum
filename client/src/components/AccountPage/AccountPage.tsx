import React from 'react'
import AccountData from './AccountData'
import AccountEditNav from './AccountEditNav'

export default function AccountPage(): JSX.Element {
    return (
        <>
            <AccountEditNav />
            <AccountData />
        </>
    )
}