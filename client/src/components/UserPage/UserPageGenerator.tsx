import React, { useEffect, useState } from 'react'
import { UserObject, UserProfileObject } from '../interfaces/UserObjectContext'
import UserTableRow from './UserTableRow'
import UserPostList from './UserPostList'
import ReportButton from '../utils/ReportButton'

export default function UserPageGenerator({ user }: { user: UserObject }): JSX.Element {
    const [reported, setReported] = useState<boolean>(false)
    const data: UserProfileObject =
    {
        login: user.login,
        posts: user.posts,
        comments: user.comments,
        lastActive: user.lastActive,
        entryDate: user.entryDate
    }
    useEffect(() => {
        setReported(false)
    }, [user])
    return (
        <>
            <div className="UserPageTable">
                <div className="AccountPageReport">
                    {reported ? <div className="pt-2 mr-1 underline ">User reported</div> : <ReportButton reported={reported} setReported={setReported} type={'user'} id={user._id} />}
                </div>
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