import React from 'react'
import { useUserContext } from '../contexts/UserContext'
import { UserObject } from '../interfaces/UserObjectContext'
import AccountTableRow from './AccountTableRow'
import UserPostList from '../UserPage/UserPostList'
export default function AccountData(): JSX.Element {
    const { userInfo } = useUserContext()
    const { login, email, posts, comments, lastActive, entryDate } = userInfo
    const mapData = { login, email, posts, comments, lastActive, entryDate }
    const avatarUrl: string = `http://localhost:4000/api/getImage/${userInfo.profilePicture}`
    return userInfo._id ? (
        <>
            <div className="AccountPageTable">
                <div className="AccountPageImage">
                    <img src={avatarUrl} alt="avatar" />
                </div>
                <div className="AccountPageTableBody">
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
            </div>
            <div>
                <div className="AccountPagePostList">
                    <UserPostList login={login} />
                </div>
            </div>


        </>
    ) : (
        <>
            <div>loading...</div>
        </>
    )
}