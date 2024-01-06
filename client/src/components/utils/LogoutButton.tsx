import React from 'react'
import { useUserContext } from '../contexts/UserContext'

export default function LogoutButton(): JSX.Element | null {
    const storageData: string | null = localStorage.getItem('token')
    const {loggedIn, setLoggedIn} = useUserContext()
    function handleLogout(event: React.MouseEvent<HTMLButtonElement>): void {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setLoggedIn(false)
    }
    
    return loggedIn ? (
        <>
            <button onClick={handleLogout}>Logout</button>
        </>
    ) : null
}
