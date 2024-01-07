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
                    <tbody>
                    {Object.keys(userInfo).map((key: string, idx: number) => {
                        return (
                            <AccountTableRow
                                key={idx}
                                propKey={key}
                                idx={idx}
                                userInfo={userInfo[key as keyof UserObject]}
                            />
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </>
    )
}