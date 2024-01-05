import React, { useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import axios, { AxiosError, AxiosResponse } from 'axios'

export default function LoginForm (): JSX.Element {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {setLoggedIn, setUserInfo} = useUserContext()
    function handleLoginChange (event: React.ChangeEvent<HTMLInputElement>): void { 
        event.preventDefault()
        setLogin(event.target.value) 
    }
    function handlePasswordChange (event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault() 
        setPassword(event.target.value) 
    }
    function handleSubmit (event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault()
        axios.post('http://localhost:4000/api/login', {login, password})
            .then((res: AxiosResponse): void => {
                setLoggedIn(true)
                setUserInfo(res.data)
                console.log(res.data)
            })
            .catch((err: AxiosError): void => {
                setLoggedIn(false)
                console.log("error", err)
            })
    }
    return (
        <>
        <div>Log into your account: </div>
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="login">Your username: </label>
                <input type="text" id="login" onChange={handleLoginChange}/>
                <label htmlFor="password">Your password: </label>
                <input type="password" id="password" onChange={handlePasswordChange}/>
                <button type="submit">Login</button>
            </form>
        </div>
        </>
    )
}