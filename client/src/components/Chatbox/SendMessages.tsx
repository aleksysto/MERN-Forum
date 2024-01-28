import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import DOMPurify from 'dompurify'
import { useUserContext } from '../contexts/UserContext'
const mqtt = require('precompiled-mqtt')
const client = mqtt.connect("ws://localhost:8000/mqtt");
client.subscribe("postMessages", (err: Error) => {
    if (!err) {
        console.log("subscribed to messages");
    }
});
export default function MessageEditor(): JSX.Element {
    const [content, setContent] = useState<string>('')
    const [errors, setErrors] = useState<null | string>(null)
    const { userInfo, loggedIn } = useUserContext()
    function handleQuillChange(value: string): void {

        if (value.length < 10) {
            setErrors('Content must be at least 10 characters long')
        } else {
            setErrors(null)
        }

        setContent(value)
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!errors) {
            const sanitizedContent: string = DOMPurify.sanitize(content)
            const submitMessage = {
                token: localStorage.getItem('token'),
                content: sanitizedContent,
                author: userInfo.login,
                userId: userInfo._id,
                userProfilePicture: userInfo.profilePicture
            }
            client.publish("postMessages", JSON.stringify(submitMessage))
        } else {
            setErrors('You can only submit the post after meeting the requirements')
        }
    }
    return loggedIn ? (
        <>
            <div>
                <div>{errors ? <>{errors}</> : null}</div>
                <form onSubmit={handleSubmit}>
                    <div id='editor-container'>
                        <ReactQuill
                            value={content}
                            onChange={handleQuillChange}
                            modules={{
                                toolbar: {
                                    container: [
                                        [{ 'header': [1, 2, false] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                        ['link'],
                                        ['clean']
                                    ],
                                }
                            }}
                            formats={[
                                'header',
                                'bold', 'italic', 'underline', 'strike', 'blockquote',
                                'list', 'bullet', 'indent',
                                'link', 'image'
                            ]}

                        />
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </>
    ) : (
        <div>
            You must be logged in to send messages
        </div>
    )
}