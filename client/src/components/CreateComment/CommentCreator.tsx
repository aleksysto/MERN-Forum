import React, { useState } from 'react'
import CommentEditor from './CommentEditor'
import { Provider } from 'react-redux'
import commentsStore from '../reducers/stores/store'

export default function CommentCreator(): JSX.Element {
    const [message, setMessage] = useState<string>('')
    return (
        <>
            <div>
                <div>{message}</div>
                <div>
                    <CommentEditor setMessage={setMessage} />
                </div>
            </div>
        </>
    )
}