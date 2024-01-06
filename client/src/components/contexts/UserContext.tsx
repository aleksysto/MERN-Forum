import React, {createContext, useContext, useEffect, useState} from 'react'
import { UserContextType, UserObject } from '../interfaces/UserObjectContext';


export const userContext: React.Context<UserContextType> = createContext<UserContextType>({
    loggedIn: false,
    setLoggedIn: () => {},
    userInfo: {
        login: "",
        email: "",
        posts: 0,
        comments: 0,
        type: "user",
        lastActive: new Date(),
        entryDate: new Date()},
    setUserInfo: () => {}})
export function useUserContext() {
    return useContext(userContext);
}

export default function UserProvider ({children}: {children: JSX.Element}): JSX.Element{
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<UserObject>(
        {
            login: "",
            email: "",
            posts: 0,
            comments: 0,
            type: "user",
            lastActive: new Date(),
            entryDate: new Date()
        })
    useEffect((): void => {
        if(localStorage.getItem("token")){
            setLoggedIn(true)
        }
        if(localStorage.getItem("user")){
            setUserInfo(JSON.parse(localStorage.getItem("user") as string))
        }
    }, [])
    return (
        <userContext.Provider value={{loggedIn, setLoggedIn, userInfo, setUserInfo}}>
            {children}
        </userContext.Provider>
    )
}


