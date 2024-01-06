import React from 'react'
import { useUserContext } from '../contexts/UserContext'
import { UserObject } from '../interfaces/UserObjectContext'
import AccountTableRow from './AccountTableRow'

export default function AccountData(): JSX.Element {
    const { userInfo } = useUserContext()
    return (
        <>
            <div>
                <table>
                    {Object.keys(userInfo).map((key: string, idx: number) => {
                        console.log(typeof userInfo[key as keyof UserObject])
                        return (
                            <tr>
                                <th>{key}:</th>
                                <td>{userInfo[key as keyof UserObject].toString()}</td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        </>
    )
}