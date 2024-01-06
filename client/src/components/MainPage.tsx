import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from './contexts/UserContext';
import LogoutButton from './utils/LogoutButton';

export default function MainPage(): JSX.Element {
    const {loggedIn} = useUserContext()
    useEffect(() => {}, [loggedIn])
    return (
        <>
            <div>
                <div>
                    Forum Logo
                </div>
                <nav> 
                <Link to={{ pathname: '/register'}}>Register</Link>
                <br />
                <Link to={{ pathname: '/login'}}>Login</Link>
                <br />
                <Link to={{ pathname: '/account'}}>Account</Link>
                <br />
                <LogoutButton />
                </nav>
            </div>
        </>
    ) 
}