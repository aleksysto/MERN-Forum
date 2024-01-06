import {Navigate } from 'react-router-dom';

export default function PrivateRoute ({children}: {children: JSX.Element}): JSX.Element {
    const storageData: string | null = localStorage.getItem('token')
    return storageData ? children : <Navigate to="/login" />
}