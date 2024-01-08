import React, { useState } from 'react'
import PostEditor from './PostEditor'

export default function PostCreator():JSX.Element {
    const [created, setCreated] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    return created ? (
        <>
            <div>{message}</div>
        </>
    ) : (
        <>
            <PostEditor setCreated={setCreated} setMessage={setMessage}/>
        </>
    )
}