import React, { useContext, useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import { UserObject } from '../interfaces/UserObjectContext'
import DateCreator from '../DateCreator/DateCreator'
import EditLoginForm from '../EditAccountForm/EditLoginForm'
import EditPasswordForm from '../EditAccountForm/EditPasswordForm'
import EditEmailForm from '../EditAccountForm/EditEmailForm'

export default function UserTableRow({ propKey, idx, userInfo }: { propKey: string, idx: number, userInfo: UserObject[keyof UserObject] }): JSX.Element {
    return propKey === 'lastActive' || propKey === 'entryDate' ? (
        <>
            <tr key={idx}>
                <th>{propKey === 'lastActive' ? "Last activity" : "Registration date"}:</th>
                <td><DateCreator date={userInfo as Date} /></td>
            </tr>
        </>
    ) : (
        <tr key={idx}>
            <th>{propKey[0].toUpperCase() + propKey.slice(1)}:</th>
            <td>{userInfo.toString()}</td>
        </tr>
    )
}