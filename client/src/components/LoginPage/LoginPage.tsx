import React, { useState } from 'react'

export default function LoginPage (): JSX.Element {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
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
        console.log(login, password)
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