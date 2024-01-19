import React, { createContext, useContext, useEffect, useState } from 'react'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import { AdminContextType, AppAction, AppState } from '../interfaces/AdminReducerTypes';
import useAdminReducer, { initialState } from '../reducers/AdminReducer';
export const adminContext: React.Context<AdminContextType> = createContext<AdminContextType>([
    initialState,
    () => { }
])
export function useAdminContext() {
    return useContext(adminContext);
}

export default function AdminProvider({ children }: { children: JSX.Element }): JSX.Element {
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminReducer()
    return (
        <adminContext.Provider value={[state, dispatch]}>
            {children}
        </adminContext.Provider>
    )
}


