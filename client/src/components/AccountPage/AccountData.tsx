import React from 'react'
import { useUserContext } from '../contexts/UserContext'
import { UserObject } from '../interfaces/UserObjectContext'
import AccountTableRow from './AccountTableRow'
export default function AccountData(): JSX.Element {
    const { userInfo } = useUserContext()
    const avatarUrl: string = `http://localhost:4000/api/getImage/${userInfo.profilePicture}`
    console.log(`http://localhost:4000/api/getImage/${userInfo.profilePicture}`)
    return (
        <>
            <div>
                <img src={avatarUrl} alt="avatar" />
                <table>
                    <tbody>
                        {Object.keys(userInfo).map((key: string, idx: number) => {
                            return key !== 'profilePicture' ? (
                                <AccountTableRow
                                    key={idx}
                                    propKey={key}
                                    idx={idx}
                                    userInfo={userInfo[key as keyof UserObject]}
                                />
                            ) : null
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}