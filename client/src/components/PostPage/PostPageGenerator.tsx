import React, { useEffect, useState } from 'react'
import { Link, Params, useParams } from 'react-router-dom'
import { AggregatePostObject } from '../interfaces/ForumPosts'
import axios, { AxiosError, AxiosResponse } from 'axios'
import DateCreator from '../DateCreator/DateCreator'
import { useUserContext } from '../contexts/UserContext'
import { checkAdmin, checkAuthor } from '../utils/CheckPermissions'
import EditPost from '../CreatePost/EditPost'
import ReportButton from '../utils/ReportButton'
import DeleteButton from '../utils/DeleteButton'

export default function PostPage({ setError }: { setError: React.Dispatch<React.SetStateAction<string | null>> }): JSX.Element {
    const { id }: Readonly<Params<string>> = useParams()
    const [post, setPost] = useState<AggregatePostObject | null>(null)
    const [editing, setEditing] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [reported, setReported] = useState<boolean>(false)
    const [action, setAction] = useState<boolean>(false);
    const [confirm, setConfirm] = useState<boolean>(false);
    function handleDelete() {
        axios.delete(`http://localhost:4000/api/posts/id/${post?._id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse) => {
                setMessage('Deleted')
            })
            .catch((err: AxiosError<{ message: string }>) => {
                err.response
                    ? setError(`${err.response.data.message} please refresh the page`)
                    : setError('Server Error')
            })
    }
    useEffect((): void => {
        axios.get(`http://localhost:4000/api/posts/id/${id}`)
            .then((res: AxiosResponse<{ message: string, post: AggregatePostObject[] }>): void => {
                setPost(res.data.post[0])
            })
            .catch((err: AxiosError): void => {
                setError('Post not found')
                console.log(err, id)
            })
    }, [])
    const { userInfo } = useUserContext()
    return post ? (
        <>
            {editing ? <EditPost setMessage={setMessage} post={post} setEditing={setEditing} /> : (
                <>
                    <div className='PostPagePostHeader flex flex-row justify-between'>
                        <div className="flex flex-row ">
                            <Link to={{ pathname: `/user/${post.userId}` }} className="flex flex-row no-underline text-standard-text">
                                <div><img className="max-w-[5em]" src={`http://localhost:4000/api/getImage/${post.userProfilePicture}`} alt="" /></div>
                                <div className="PostPageAuthor">{post.author}</div>
                            </Link>
                        </div>
                        <div className="flex flex-col">
                            <div className="PostPageDate"><DateCreator date={post.date} /></div>
                            <div className="flex flex-row">
                                <div className="PostDeleteButton">
                                    {!confirm ?
                                        (checkAuthor(userInfo, post.author) || checkAdmin(userInfo) ? <DeleteButton action={action} setAction={setAction} confirm={confirm} setConfirm={setConfirm} handleAction={handleDelete} /> : null)
                                        : (
                                            <div>{message}</div>
                                        )
                                    }
                                </div>
                                <div className="pr-3">
                                    {reported ? <div className="pt-2 mr-1 underline ">Post reported</div> : <ReportButton reported={reported} setReported={setReported} type={'post'} id={post._id} />}
                                </div>
                                <div className="PostPageEdit">
                                    {checkAuthor(userInfo, post.author) || checkAdmin(userInfo) ? <button onClick={() => setEditing(!editing)}>Edit</button> : null}
                                </div>

                            </div>
                        </div>
                    </div>
                    <h2>{post.title}</h2>
                    <div><div className="DangerousPostPage" dangerouslySetInnerHTML={{ __html: post.content }}></div></div>
                </>
            )}


        </>
    ) : (
        <div>Loading...</div>
    )
}