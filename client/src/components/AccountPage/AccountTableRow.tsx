import React, { useContext } from 'react'
import { useUserContext } from '../contexts/UserContext'
import { UserObject } from '../interfaces/UserObjectContext'

export default function AccountTableRow ({propKey, idx, userInfo}: {propKey: string, idx: number, userInfo: UserObject[keyof UserObject]}): JSX.Element {
    return propKey === 'lastActive' || propKey === 'entryDate' ? (
        <>
        <tr key={idx}>
            <th>{propKey === 'lastActive' ? "Your last post/comment" : "Your registration date"}:</th>
            <td>{userInfo.toString().split('T')[0]}</td>
        </tr>
        </>
    ):(
        <tr key={idx}>
            <th>{propKey}:</th>
            <td>{userInfo.toString()}</td>
        </tr>
    )
}