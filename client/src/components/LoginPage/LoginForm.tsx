import React, { useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { UserObject } from '../interfaces/UserObjectContext'
import { useCookies } from 'react-cookie'

export default function LoginForm(): JSX.Element {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const { setLoggedIn, setUserInfo } = useUserContext()
    const [cookies, setCookie] = useCookies()
    function handleLoginChange(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault()
        setLogin(event.target.value)
    }
    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault()
        setPassword(event.target.value)
    }
    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault()
        axios.post('http://localhost:4000/api/login', { login, password })
            .then((res: AxiosResponse<{ token: string, user: UserObject }>): void => {
                const { _id, login, email, posts, comments, type, lastActive, entryDate, profilePicture }: UserObject = res.data.user
                setLoggedIn(true)
                setUserInfo({ _id, login, email, posts, comments, type, lastActive, entryDate, profilePicture })
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", JSON.stringify(res.data.user))
                setCookie('token', res.data.token, { expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) })
            })
            .catch((err: AxiosError): void => {
                setLoggedIn(false)
                setMessage("Wrong login or password")
            })
    }
    return (
        <>
            <div>Log into your account: </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="login">Your username: </label>
                    <input type="text" id="login" onChange={handleLoginChange} />
                    <label htmlFor="password">Your password: </label>
                    <input type="password" id="password" onChange={handlePasswordChange} />
                    <button type="submit">Login</button>
                </form>
                <div>{message}</div>
            </div>
        </>
    )
}