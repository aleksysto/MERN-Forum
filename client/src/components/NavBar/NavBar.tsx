import React, { useEffect } from 'react'
import { useUserContext } from '../contexts/UserContext'
import { Link } from 'react-router-dom'
import LogoutButton from './LogoutButton'
import SearchBar from '../SearchBar/SearchBar'
import { UserContextType } from '../interfaces/UserObjectContext'
import RegisterButton from './RegisterButton'
import LoginButton from './LoginButton'
import AccountButton from './AccountButton'

export default function NavBar() {
    const { loggedIn }: UserContextType = useUserContext()
    useEffect(() => {
    }, [loggedIn])

    return (
        <>
            <div id="nav">
                <div>
                    <Link to={{ pathname: '/' }}>
                        <button>
                            Forum Logo
                        </button>
                    </Link>
                </div>
                <nav>
                    <div>
                        <RegisterButton />
                    </div>
                    <div>
                        <LoginButton />
                    </div>
                    <div>
                        <AccountButton />
                    </div>
                    <div>
                        <LogoutButton />
                    </div>
                    <div>
                        <SearchBar />
                    </div>
                </nav>
            </div>
        </>
    )
}