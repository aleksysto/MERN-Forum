import React from 'react'
import LoginForm from './LoginForm'
import { useUserContext } from '../contexts/UserContext'
import { Link } from 'react-router-dom'

export default function LoginPage (): JSX.Element {
    const {loggedIn} = useUserContext()
    return !loggedIn ? (
        <>
            <LoginForm />
        </>
    ) : (
        <>
            <Link to={{ pathname: '/'}}>Go back to main page</Link>
        </>
    )
}