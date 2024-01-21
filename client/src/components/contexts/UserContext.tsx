import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContextType, UserObject } from '../interfaces/UserObjectContext';
import { JwtPayload, jwtDecode } from 'jwt-decode'
export const userContext: React.Context<UserContextType> = createContext<UserContextType>({
    loggedIn: false,
    setLoggedIn: () => { },
    userInfo: {
        _id: '',
        login: "",
        email: "",
        posts: 0,
        comments: 0,
        type: "user",
        lastActive: new Date(),
        entryDate: new Date(),
        profilePicture: ""
    },
    setUserInfo: () => { }
})
export function useUserContext() {
    return useContext(userContext);
}

type customPayload = JwtPayload & UserObject
export default function UserProvider({ children }: { children: JSX.Element }): JSX.Element {
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<UserObject>({} as UserObject)
    async function decodeToken(): Promise<void> {
        const token: string = localStorage.getItem("token") as string
        const decodedToken: customPayload | string = await jwtDecode(token)
        if (typeof decodedToken !== "string") {

            const { _id, login, email, posts, comments, type, lastActive, entryDate, profilePicture }: UserObject = decodedToken
            setUserInfo({ _id, login, email, posts, comments, type, lastActive, entryDate, profilePicture })
        }
    }
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setLoggedIn(true)
            decodeToken()
        }
    }, [])
    return (
        <userContext.Provider value={{ loggedIn, setLoggedIn, userInfo, setUserInfo }}>
            {children}
        </userContext.Provider>
    )
}


