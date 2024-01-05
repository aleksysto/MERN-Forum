import React, {createContext, useContext, useState} from 'react'

interface UserContextType {
    loggedIn: boolean
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    userInfo: Object
    setUserInfo: React.Dispatch<React.SetStateAction<Object>>
}

export const userContext: React.Context<UserContextType> = createContext<UserContextType>({
    loggedIn: false,
    setLoggedIn: () => {},
    userInfo: {},
    setUserInfo: () => {}})
export function useUserContext() {
    return useContext(userContext);
}

export default function UserProvider ({children}: {children: JSX.Element}): JSX.Element{
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<Object>({})
    return (
        <userContext.Provider value={{loggedIn, setLoggedIn, userInfo, setUserInfo}}>
            {children}
        </userContext.Provider>
    )
}


