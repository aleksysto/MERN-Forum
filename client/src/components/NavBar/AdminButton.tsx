import React from 'react'
import { useUserContext } from '../contexts/UserContext'
import { Link } from 'react-router-dom'
import { UserContextType } from '../interfaces/UserObjectContext'

export default function AdminPanelButton() {
    const { loggedIn, userInfo }: UserContextType = useUserContext()
    return loggedIn && (userInfo.type === 'admin' || userInfo.type === 'moderator') ? (
        <>
            <Link to={{ pathname: '/admin' }}>
                <button>
                    Admin panel
                </button>
            </Link>
        </>
    ) : null
}