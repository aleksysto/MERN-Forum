import React, { useEffect } from 'react'
import { useUserContext } from '../contexts/UserContext'
import { Link } from 'react-router-dom'
import LogoutButton from './LogoutButton'
import SearchBar from '../SearchBar/SearchBar'
import { UserContextType } from '../interfaces/UserObjectContext'
import RegisterButton from './RegisterButton'
import LoginButton from './LoginButton'
import AccountButton from './AccountButton'
import AdminPanelButton from './AdminButton'

export default function NavBar() {
    const { loggedIn }: UserContextType = useUserContext()
    useEffect(() => {
    }, [loggedIn])

    return (
        <>
            <div className="NavBar">
                <nav>
                    <div className="NavLogo">
                        <div >
                            <Link to={{ pathname: '/' }} className="LogoButton">
                                Forum Logo
                            </Link>
                        </div>
                    </div>
                    <div className="SearchBar">
                        <SearchBar />
                    </div>
                    <div className="NavButtons">
                        <div>
                            <AdminPanelButton />
                        </div>
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
                    </div>
                </nav>
            </div>
        </>
    )
}