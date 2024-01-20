import React from 'react'
import { useUserContext } from '../contexts/UserContext'
import { Link } from 'react-router-dom'
import { UserContextType } from '../interfaces/UserObjectContext'

export default function RegisterButton() {
    const { loggedIn }: UserContextType = useUserContext()
    return !loggedIn ? (
        <>
            <Link to={{ pathname: '/register' }}>
                <button>
                    Register
                </button>
            </Link>
        </>
    ) : null
}