import React, { useState } from "react";
import { CommentListItemProps } from "../../interfaces/PostComments";
import DateCreator from "../../DateCreator/DateCreator";
import { AppAction, AppState } from "../../interfaces/AdminReducerTypes";
import { useAdminContext } from "../../contexts/AdminContext";
import useConfirm from "../../hooks/useConfirm";
import DeleteButton from "../../utils/DeleteButton";
import axios, { AxiosError, AxiosResponse } from "axios";
import AdminCommentEditor from "../AdminComponents/AdminCommentEditor";
import { Link } from "react-router-dom";
export default function CommentPanel({
    comment,
    index,
}: CommentListItemProps): JSX.Element {
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const { action, setAction, confirm, setConfirm } = useConfirm()
    const [editing, setEditing] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    function handleDelete() {
        axios.delete(`http://localhost:4000/api/comments/id/${comment._id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse<{ message: string }>): void => {
                dispatch({ type: 'setMessage', payload: { message: "Comment deleted" } })
                dispatch({ type: 'removeComment', payload: { id: comment._id } })
                setMessage(state.message)
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
                {!editing ? (
                    <>
                        <div className="AdminPanelComment">

                            <div className="AdminPanelCommentHeader flex flex-row justify-between">
                                <Link to={{ pathname: `/user/${comment.userId}` }} className="CommentAuthorLinkAdmin text-2xl flex flex-row no-underline text-standard-text">
                                    <div className="AdminPanelCommentPictureContainer"><img className="AdminPanelCommentPicture" src={`http://localhost:4000/api/getImage/${comment.userProfilePicture}`} alt="" /></div>
                                    <div className="AdminPanelCommentAuthor">{comment.author}</div>
                                </Link>
                                <div className="AdminPanelCommentDate flex flex-col">
                                    <div className="AdminPanelCommentDate flex flex-row justify-end"><DateCreator date={comment.date} /></div>
                                    <div className="flex flex-row justify-end"><button onClick={() => setEditing(!editing)}>edit</button></div>
                                    <DeleteButton {...{ action, setAction, confirm, setConfirm, handleAction: handleDelete }} />
                                </div>
                            </div>
                            <div className="DangerousAdminCommentHtml" dangerouslySetInnerHTML={{ __html: comment.content }}></div>
                        </div>
                    </>
                ) : (
                    <>
                        <div>{message}</div>
                        <AdminCommentEditor setMessage={setMessage} comment={comment} setEditing={setEditing} />
                    </>
                )}
            </li>
        </>
    )



}
