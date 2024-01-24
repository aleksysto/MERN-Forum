import React from 'react'
import { UserObject, UserProfileObject } from '../interfaces/UserObjectContext'
import UserTableRow from './UserTableRow'
import UserPostList from './UserPostList'

export default function UserPageGenerator({ user }: { user: UserObject }): JSX.Element {
    const data: UserProfileObject =
    {
        login: user.login,
        posts: user.posts,
        comments: user.comments,
        lastActive: user.lastActive,
        entryDate: user.entryDate
    }
    console.log()
    return (
        <>
            <div className="UserPageTable">
                <div className="AccountPageImage">
                    <img src={`http://localhost:4000/api/getImage/${user.profilePicture}`} alt="avatar" />
                </div>
                <div className="AccountPageTableBody">
                    <table>
                        <tbody>
                            {Object.keys(data).map((key: string, idx: number) => {
                                return key !== 'profilePicture' ? (
                                    <UserTableRow
                                        key={idx}
                                        propKey={key}
                                        idx={idx}
                                        userInfo={user[key as keyof UserObject]}
                                    />
                                ) : null
                            })}
                        </tbody>
                    </table>
                </div>
                <div>
                    <UserPostList login={user.login} />
                </div>
            </div>
        </>
    )
}