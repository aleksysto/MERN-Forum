import React, { useState } from 'react'
import ReactQuill, { UnprivilegedEditor } from 'react-quill'
import { DeltaStatic, Sources, DeltaOperation } from 'quill'
import DOMPurify from 'dompurify'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useUserContext } from '../contexts/UserContext'
import { EditorComponentProps, UploadPost } from '../interfaces/EditorComponent'
import { Params, useParams } from 'react-router-dom'
export default function PostEditor({ setCreated, setMessage }: EditorComponentProps): JSX.Element {
    const [content, setContent] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [errors, setErrors] = useState<null | string>(null)
    const { userInfo } = useUserContext()
    const { category }: Readonly<Params<string>> = useParams()
    function handleQuillChange(value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor): void {
        const images: DeltaOperation[] | undefined = editor.getContents().ops?.filter((op: DeltaOperation): boolean => op.insert?.image).slice(-1)
        console.log(images)
        if (images && images.length > 0) {
            if (value.length < 50) {
                setErrors('Content must be at least 50 characters long')
            } else {
                setErrors(null)
            }
            const imageString: string = images[0].insert.image
            const imageStringLength: number = imageString.length - 22;
            const sizeInBytes: number = 4 * Math.ceil(imageStringLength / 3) * 0.5624896334383812
            const maxSize: number = 1048576
            const i = new Image()
            i.src = imageString
            i.onload = () => {
                if (sizeInBytes > maxSize) {
                    setErrors('File size too big, please remove the image and try again')
                } else if (i.width > 2048 && i.height > 2048) {
                    setErrors('We only accept images that are 2048x2048 or less, please remove the image and try again')
                }
            }
        } else {
            if (value.length < 50) {
                setErrors('Content must be at least 50 characters long')
            } else {
                setErrors(null)
            }
        }

        setContent(value)
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
            const submitPost: UploadPost = {
                title: title,
                author: author,
                content: sanitizedContent
            }
            axios.post(`http://localhost:4000/api/posts/${category}`, submitPost, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
                .then((res: AxiosResponse<{ message: string }>): void => {
                    setCreated(true)
                    setMessage(res.data.message)
                })
                .catch((err: AxiosError): void => {
                    console.log(err)
                })
            console.log(submitPost)
            console.log(content)
        } else {
            setErrors('You can only submit the post after meeting the requirements')
        }
    }
    return (
        <>
            <div>
                <div>{errors ? <>{errors}</> : null}</div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Post title: </label>
                    <input type="text" id='title' onChange={handleTitleChange} />
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
                                        ['link', 'image'],
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
                    <input type="submit" />
                </form>
            </div>
        </>
    )
}