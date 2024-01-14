import React, { useContext } from 'react'
import { useUserContext } from '../contexts/UserContext'
import { UserObject } from '../interfaces/UserObjectContext'
import DateCreator from '../DateCreator/DateCreator'

export default function AccountTableRow({ propKey, idx, userInfo }: { propKey: string, idx: number, userInfo: UserObject[keyof UserObject] }): JSX.Element {
    return propKey === 'lastActive' || propKey === 'entryDate' ? (
        <>
            <tr key={idx}>
                <th>{propKey === 'lastActive' ? "Your last activity" : "Your registration date"}:</th>
                <td><DateCreator date={userInfo as Date} /></td>
            </tr>
        </>
    ) : (
        <tr key={idx}>
            <th>{propKey}:</th>
            <td>{userInfo.toString()}</td>
        </tr>
    )
}