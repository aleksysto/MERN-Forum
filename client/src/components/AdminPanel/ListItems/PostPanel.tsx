import React, { useEffect, useState } from 'react'
import { Params, useParams } from 'react-router-dom'
import { AggregatePostObject, PostItemProps } from '../../interfaces/ForumPosts'
import axios, { AxiosError, AxiosResponse } from 'axios'
import DateCreator from '../../DateCreator/DateCreator'
import { useUserContext } from '../../contexts/UserContext'
import EditPost from '../../CreatePost/EditPost'
import { AppAction, AppState } from '../../interfaces/AdminReducerTypes'
import { useAdminContext } from '../../contexts/AdminContext'
import DeleteButton from '../../utils/DeleteButton'
import useConfirm from '../../hooks/useConfirm'
export default function PostPanel({ post, index }: PostItemProps): JSX.Element {
    const { deleting, setDeleting, confirm, setConfirm } = useConfirm()
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const [editing, setEditing] = useState<boolean>(false)
    const [message, setMessage] = useState('')
    function handleDelete() {
        axios.delete(`http://localhost:4000/api/posts/id/${post._id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse<{ message: string }>): void => {
                dispatch({ type: 'setMessage', payload: { message: "Post deleted" } })
                dispatch({ type: 'removePost', payload: { id: post._id } })
            })
            .catch((err: AxiosError<{ message: string }>): void => {
                err.response
                    ? dispatch({ type: 'setMessage', payload: { message: err.response.data.message } })
                    : dispatch({ type: 'setMessage', payload: { message: 'Server Error' } })
            })
    }

    return deleting && confirm ? (
        <>
            <div
            >Deleted!
            </div>
        </>
    ) : (
        <>
            <li key={index}>
                {editing ? (
                    <>
                        <div>
                            {message}
                        </div>
                        <div>
                            <div>{message}</div>
                            <EditPost setMessage={setMessage} post={post} setEditing={setEditing} />
                        </div>
                    </>
                ) : (
                    <>
                        <div><div>{post.author}</div><div><DateCreator date={post.date} /></div></div>
                        <h2>{post.title}</h2>
                        <div><div dangerouslySetInnerHTML={{ __html: post.content }}></div></div>
                    </>
                )}
                <button onClick={() => setEditing(!editing)}>Edit</button>
                <DeleteButton {...{ deleting, setDeleting, confirm, setConfirm, handleDelete }} />
            </li >
        </>

    )
}