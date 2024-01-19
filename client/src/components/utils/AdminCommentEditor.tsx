import React, { useState } from 'react'
import ReactQuill, { UnprivilegedEditor } from 'react-quill'
import { DeltaStatic, Sources, DeltaOperation } from 'quill'
import DOMPurify from 'dompurify'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Comment } from '../interfaces/PostComments'
import { EditedComment, EditCommentProps } from '../interfaces/EditorComponent'
export default function AdminCommentEditor({ setMessage, comment, setEditing }: EditCommentProps): JSX.Element {
    const [content, setContent] = useState<string>(comment.content)
    const [errors, setErrors] = useState<null | string>(null)
    const token: string | null = localStorage.getItem('token')
    function handleQuillChange(value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor): void {
        const images: DeltaOperation[] | undefined = editor.getContents().ops?.filter((op: DeltaOperation) => op.insert?.image)
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

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!errors) {
            const sanitizedContent: string = DOMPurify.sanitize(content)
            const submitComment: EditedComment = {
                content: sanitizedContent
            }
            axios.patch(`http://localhost:4000/api/comments/id/${comment._id}`, submitComment, { headers: { 'Authorization': `${token as string}` } })
                .then((res: AxiosResponse<{ message: string, comment: Comment }>): void => {
                    setMessage(res.data.message)
                    setEditing(false)
                })
                .catch((err: AxiosError<{ message: string }>): void => {
                    err.response?.data.message ? setMessage(err.response.data.message) : setMessage('Error')
                })
        } else {
            setErrors('You can only submit the post after meeting the requirements')
        }
    }
    return (
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
                    <button onClick={(): void => setEditing(false)}>Cancel</button>
                </form>
            </div>
        </>
    )
}