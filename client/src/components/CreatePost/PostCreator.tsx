import React, { useState } from 'react'
import PostEditor from './PostEditor'
import { useNavigate } from 'react-router-dom'

export default function PostCreator(): JSX.Element {
    const [created, setCreated] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    type NavigateFunction = (path: number, options?: { replace?: boolean }) => void
    const navigate: NavigateFunction = useNavigate()
    function handleClick(): void {
        navigate(-1)
    }
    return created ? (
        <>
            <div className="GoBackToPosts">
                <div>{message}</div>
                <button onClick={handleClick}>Go back to posts</button>
            </div>
        </>
    ) : (
        <>
            <PostEditor setCreated={setCreated} setMessage={setMessage} />
        </>
    )
}