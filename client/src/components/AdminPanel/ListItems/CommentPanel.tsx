import React, { useState } from "react";
import { CommentListItemProps } from "../../interfaces/PostComments";
import DateCreator from "../../DateCreator/DateCreator";
import { AppAction, AppState } from "../../interfaces/AdminReducerTypes";
import { useAdminContext } from "../../contexts/AdminContext";
import useConfirm from "../../hooks/useConfirm";
import DeleteButton from "../../utils/DeleteButton";
import axios, { AxiosError, AxiosResponse } from "axios";
import AdminCommentEditor from "../../utils/AdminCommentEditor";
export default function CommentPanel({
    comment,
    index,
}: CommentListItemProps): JSX.Element {
    const { deleting, setDeleting, confirm, setConfirm } = useConfirm()
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const [editing, setEditing] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    function handleDelete() {
        axios.delete(`http://localhost:4000/api/comments/id/${comment._id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse<{ message: string }>): void => {
                dispatch({ type: 'setMessage', payload: { message: "Comment deleted" } })
                dispatch({ type: 'removeComment', payload: { id: comment._id } })
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
                {!editing ? (
                    <>
                        <div>
                            <button onClick={() => setEditing(!editing)}>edit</button>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "auto" }}>
                                <div>{comment.author}</div><img style={{ width: "30px", height: "30px" }} src={`http://localhost:4000/api/getImage/${comment.userProfilePicture}`} alt="" /> <div><DateCreator date={comment.date} /></div>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: comment.content }}></div>
                        </div>
                    </>
                ) : (
                    <>
                        <div>{message}</div>
                        <AdminCommentEditor setMessage={setMessage} comment={comment} setEditing={setEditing} />
                        <DeleteButton {...{ deleting, setDeleting, confirm, setConfirm, handleDelete }} />
                    </>
                )}
            </li>
        </>
    )



}
