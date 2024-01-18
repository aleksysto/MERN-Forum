import React from 'react'
import { useUserContext } from '../contexts/UserContext'
import { UserObject } from '../interfaces/UserObjectContext'
import AccountTableRow from './AccountTableRow'
export default function AccountData(): JSX.Element {
    const { userInfo } = useUserContext()
    const { login, email, posts, comments, lastActive, entryDate } = userInfo
    const mapData = { login, email, posts, comments, lastActive, entryDate }
    const avatarUrl: string = `http://localhost:4000/api/getImage/${userInfo.profilePicture}`
    console.log(userInfo._id)
    return userInfo._id ? (
        <>
            <div>
                <img src={avatarUrl} alt="avatar" />
                <table>
                    <tbody>
                        {Object.keys(mapData).map((key: string, idx: number) => {
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
    ) : (
        <>
            <div>loading...</div>
        </>
    )
}