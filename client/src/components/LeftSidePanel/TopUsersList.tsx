import React, { useEffect, useState } from 'react'
import { UserActivityObject } from '../interfaces/User'
import axios, { AxiosError, AxiosResponse } from 'axios'
import TopUserListItem from './TopUserListItem'

export default function TopUsersList() {
    const [users, setUsers] = useState<UserActivityObject[]>([])
    const [message, setMessage] = useState<string>('')
    useEffect(() => {
        axios.get('http://localhost:4000/api/users/combinedActivity')
            .then((res: AxiosResponse<{ message: string, users: UserActivityObject[] }>): void => {
                setUsers(res.data.users)
            })
            .catch((error: AxiosError<{ message: string }>) => {
                setMessage('Server error')
            })
    }, [])
    //
    return (
        <div className="LeftPanel">
            <div>Our top 15 users!</div>
            <ul>
                {
                    users.map((user: UserActivityObject, index: number) => {
                        return (
                            <TopUserListItem user={user} index={index} key={index} />
                        )
                    })
                }
            </ul>
            <div>{message}</div>
        </div>
    )
}