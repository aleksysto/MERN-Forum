import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import DOMPurify from 'dompurify'
import axios from 'axios'
import { useUserContext } from '../contexts/UserContext'
export default function PostEditor(): JSX.Element {
    const [content, setContent] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [errors, setErrors] = useState<null | string>(null)
    const { userInfo } = useUserContext()
    function handleQuillChange(value: any) {
        setContent(value)
        if (value.length < 32) {
            setErrors('Content must be at least 25 characters long')
        } else {
            setErrors(null)
        }
    }
    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault()
        setTitle(event.target.value)
        if (event.target.value.length < 10) {
            setErrors('Title must be at least 10 characters long')
        } else {
            setErrors(null)
        }
    }
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!errors) {
            const sanitizedContent: string = DOMPurify.sanitize(content)
            const author: string = userInfo.login
            const submitPost: any = {
                title: title,
                author: author,
                content: sanitizedContent
            }
            axios.post('http://localhost:4000/api/posts/category', submitPost).catch((err) => console.log(err))
            console.log(submitPost)
            console.log(content)
        } else {
            setErrors('You can only submit the post after meeting the requirements')
        }
    }
    return (
        <>
            <div>{errors ? <>{errors}</> : null}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Post title: </label>
                    <input type="text" id='title' onChange={handleTitleChange} />
                    <div id='editor-container'>
                        <ReactQuill
                            value={content}
                            onChange={handleQuillChange}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, false] }],
                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                    ['link', 'image'],
                                    ['clean']
                                ]
                            }}
                            formats={[
                                'header',
                                'bold', 'italic', 'underline', 'strike', 'blockquote',
                                'list', 'bullet', 'indent',
                                'link', 'image'
                            ]}

                        />
                    </div>
                    <input type="submit" />
                </form>
            </div>
        </>
    )
}