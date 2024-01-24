import React, { useState } from 'react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import DateCreator from '../../DateCreator/DateCreator'
import { AppAction, AppState } from '../../interfaces/AdminReducerTypes'
import { useAdminContext } from '../../contexts/AdminContext'
import DeleteButton from '../../utils/DeleteButton'
import useConfirm from '../../hooks/useConfirm'
import AdminPostEditor from '../AdminComponents/AdminPostEditor'
import { PostItemProps } from '../../interfaces/ForumPosts'
import { Link } from 'react-router-dom'
export default function PostPanel({ post, index }: PostItemProps): JSX.Element {
    const { action, setAction, confirm, setConfirm } = useConfirm()
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const [editing, setEditing] = useState<boolean>(false)
    const [message, setMessage] = useState('')
    function handleDelete() {
        axios.delete(`http://localhost:4000/api/posts/id/${post._id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse<{ message: string }>): void => {
                dispatch({ type: 'setMessage', payload: { message: "Post deleted" } })
                dispatch({ type: 'removePost', payload: { id: post._id } })
                setMessage('Deleted')
            })
            .catch((err: AxiosError<{ message: string }>): void => {
                err.response
                    ? dispatch({ type: 'setMessage', payload: { message: err.response.data.message } })
                    : dispatch({ type: 'setMessage', payload: { message: 'Server Error' } })
            })
    }

    return (action && confirm) || message.length > 0 ? (
        <>
            <div className="pb-4">
                {message}
            </div>
        </>
    ) : (
        <>
            <li key={index}>
                {editing ? (
                    <>
                        <div>
                            <div>{message}</div>
                            <AdminPostEditor setMessage={setMessage} post={post} setEditing={setEditing} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className='AdminPanelPost'>
                            <div className="flex flex-row justify-between">
                                <div>
                                    <Link className="no-underline text-standard-text flex flex-row" to={{ pathname: `/user/${post.userId}` }}>
                                        <div><img src={`http://localhost:4000/api/getImage/${post.userProfilePicture}`} alt="" /></div>
                                        <div className="text-2xl h-[50%] m-auto ml-2">{post.author}</div>
                                    </Link>
                                </div>
                                <div>
                                    <DateCreator date={post.date} />
                                </div>
                                <div className="AdminPostButtons flex flex-row">
                                    <button onClick={() => setEditing(!editing)}>Edit</button>
                                    <DeleteButton {...{ action, setAction, confirm, setConfirm, handleAction: handleDelete }} />
                                </div>
                            </div>
                            <h2>{post.title}</h2>
                            <div ><div className="DangerousAdminPostHtml" dangerouslySetInnerHTML={{ __html: post.content }}></div></div>
                        </div>
                    </>
                )}

            </li >
        </>

    )
}