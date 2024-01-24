import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
interface ReportButtonProps {
    reported: boolean;
    setReported: React.Dispatch<React.SetStateAction<boolean>>;
    type: 'user' | 'post' | 'comment';
    id: string
}
export default function ReportButton({ reported, setReported, type, id }: ReportButtonProps): JSX.Element | null {
    const { loggedIn } = useUserContext()
    const [message, setMessage] = useState<string | null>(null)
    function handleReport(): void {
        axios.post(`http://localhost:4000/api/reports`, { type: type, reportedId: id }, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse) => {
                setReported(true)
            })
            .catch((err: AxiosError) => {
                setMessage('Failed to report')
            })
    }
    return loggedIn ? (
        <button className="ReportButton" onClick={() => handleReport()}>{message ? message : 'Report'}</button>
    ) : null
}