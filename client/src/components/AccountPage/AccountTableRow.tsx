import React, { useContext } from 'react'
import { useUserContext } from '../contexts/UserContext'
import { UserObject } from '../interfaces/UserObjectContext'

export default function AccountTableRow ({propKey, idx, userInfo}: {propKey: string, idx: number, userInfo: UserObject[keyof UserObject]}): JSX.Element {

    return userInfo instanceof Date ? (
        <>
        <tr key={idx}>
            <th>{propKey}:</th>
            <td>{userInfo.toString().split(' ').slice(0, 4).join(' ')}</td>
        </tr>
        </>
    ):(
        <tr key={idx}>
            <th>{propKey}:</th>
            <td>{userInfo.toString()}</td>
        </tr>
    )
}