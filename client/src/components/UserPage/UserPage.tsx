import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Params, useParams } from 'react-router-dom'
import { UserObject } from '../interfaces/UserObjectContext'
import UserPageGenerator from './UserPageGenerator'

export default function UserPage(): JSX.Element {
    const { id }: Readonly<Params<string>> = useParams()
    const [user, setUser] = useState<UserObject | null>(null)
    useEffect((): void => {
        axios.get(`http://localhost:4000/api/users/id/${id}`).then((res) => {
            setUser(res.data.user)
        })
    }, [id])
    return user ? (
        <>
            <UserPageGenerator user={user} />
        </>
    ) : (
        <div className="text-3xl text-standard-text">Loading...</div>
    )
}