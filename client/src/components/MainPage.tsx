import React from 'react';
import { Link } from 'react-router-dom';

export default function MainPage(): JSX.Element {

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
                </nav>
            </div>
        </>
    );
}