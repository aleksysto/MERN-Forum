import React, { useState } from 'react'
import ReactQuill, { UnprivilegedEditor } from 'react-quill'
import { DeltaStatic, Sources, DeltaOperation } from 'quill'
import DOMPurify from 'dompurify'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { EditPostProps, EditedPost } from '../../interfaces/EditorComponent'
import { AppAction, AppState } from '../../interfaces/AdminReducerTypes'
import { useAdminContext } from '../../contexts/AdminContext'
export default function AdminPostEditor({ setMessage, post, setEditing }: EditPostProps): JSX.Element {
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const [content, setContent] = useState<string>(post.content)
    const [title, setTitle] = useState<string>(post.title)
    const [errors, setErrors] = useState<null | string>(null)
    const [select, setSelect] = useState<string>('')
    console.log(select)
    function handleQuillChange(value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor): void {
        const images: DeltaOperation[] | undefined = editor.getContents().ops?.filter((op: DeltaOperation): boolean => op.insert?.image)
        if (images && images.length > 0) {
            images.forEach((image: DeltaOperation) => {
                if (value.length < 50) {
                    setErrors('Content must be at least 50 characters long')
                } else {
                    setErrors(null)
                }
                const imageString: string = image.insert.image
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
            })
        } else {
            if (value.length < 50) {
                setErrors('Content must be at least 50 characters long')
            } else {
                setErrors(null)
            }
        }

        setContent(value)
    }

    function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        event.preventDefault()
        setSelect(event.target.value)
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
            if (select.length > 1) {
                const submitPost: EditedPost = {
                    title: title,
                    content: sanitizedContent,
                    category: select
                }
                axios.patch(`http://localhost:4000/api/posts/id/${post._id}`, submitPost, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
                    .then((res: AxiosResponse<{ message: string }>): void => {
                        setMessage(res.data.message)
                        dispatch({ type: 'removePost', payload: { id: post._id } })
                        dispatch({ type: 'setMessage', payload: { message: res.data.message } })
                        setEditing(false)
                    })
                    .catch((err: AxiosError<{ message: string }>): void => {
                        dispatch({ type: 'setMessage', payload: { message: err.response?.data.message } })
                    })
            } else {
                const submitPost: EditedPost = {
                    title: title,
                    content: sanitizedContent
                }
                axios.patch(`http://localhost:4000/api/posts/id/${post._id}`, submitPost, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
                    .then((res: AxiosResponse<{ message: string }>): void => {
                        setMessage(res.data.message)
                        dispatch({ type: 'removePost', payload: { id: post._id } })
                        dispatch({ type: 'setMessage', payload: { message: res.data.message } })
                        setEditing(false)
                    })
                    .catch((err: AxiosError<{ message: string }>): void => {
                        dispatch({ type: 'setMessage', payload: { message: err.response?.data.message } })
                    })
            }
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
                    <input type="text" id='title' value={title} onChange={handleTitleChange} />
                    <select value={select} onChange={handleSelectChange}>
                        <option value="">-</option>
                        <option value="">-Main categories-</option>
                        <option value="Category 1">Category 1</option>
                        <option value="Category 2" >Category 2</option>
                        <option value="Category 3" >Category 3</option>
                        <option value="Category 4" >Category 4</option>
                        <option value="Category 5" >Category 5</option>
                        <option value="">-Side categories-</option>
                        <option value="Side category 1">Side category 1</option>
                        <option value="Side category 2">Side category 2</option>
                        <option value="Side category 3">Side category 3</option>
                        <option value="Side category 4">Side category 4</option>
                        <option value="">-Off topic categories-</option>
                        <option value="Off topic category 1">Off topic category 1</option>
                        <option value="Off topic category 2">Off topic category 2</option>
                        <option value="Off topic category 3">Off topic category 3</option>
                    </select>
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
                    <button onClick={() => setEditing(false)}>Cancel</button>
                </form>
            </div>
        </>
    )
}