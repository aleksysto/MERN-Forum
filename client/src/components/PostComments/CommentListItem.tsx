import React, { useState } from "react";
import { CommentListItemProps } from "../interfaces/PostComments";
import DateCreator from "../DateCreator/DateCreator";
import { checkAdmin, checkAuthor } from "../utils/CheckPermissions";
import { useUserContext } from "../contexts/UserContext";
import EditComment from "../CreateComment/EditComment";
import { Link } from "react-router-dom";
import ReportButton from "../utils/ReportButton";
import DeleteButton from "../utils/DeleteButton";
import axios, { AxiosError, AxiosResponse } from "axios";
export default function CommentListItem({
    comment,
    index,
}: CommentListItemProps): JSX.Element {
    const { userInfo } = useUserContext();
    const [editing, setEditing] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [reported, setReported] = useState<boolean>(false);
    const [action, setAction] = useState<boolean>(false);
    const [confirm, setConfirm] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    function handleDelete() {
        axios.delete(`http://localhost:4000/api/comments/id/${comment._id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse) => {
                setMessage('Deleted')
            })
            .catch((err: AxiosError<{ message: string }>) => {
                err.response
                    ? setError(`${err.response.data.message} please refresh the page`)
                    : setError('Server Error')
            })
    }
    return !editing ? (
        <>

            {error ? <div>{error}</div>
                : (
                    <li key={index} className="PostPageCommentListItem" >
                        <div className="PostPageCommentListItemContainer">
                            <div className="PostPageCommentHeader flex flex-row justify-between">
                                <div className="PostPageCommentAuthorLink">
                                    <Link to={{ pathname: `/user/${comment.userId}` }} className="flex flex-row no-underline text-standard-text">
                                        <div className="AuthorImagePostComments max-w-[5em]"><img className="max-w-[5em]" src={`http://localhost:4000/api/getImage/${comment.userProfilePicture}`} alt="" /></div>
                                        <div className="AuthorNamePostComments text-2xl">{comment.author}</div>
                                    </Link>
                                </div>
                                <div className="PostPageCommentDate">
                                    <div><DateCreator date={comment.date} /></div>
                                    <div className="HandleButtonsComments">
                                        {
                                            !confirm ? (
                                                checkAuthor(userInfo, comment.author) || checkAdmin(userInfo) ? <DeleteButton action={action} setAction={setAction} confirm={confirm} setConfirm={setConfirm} handleAction={handleDelete} /> : null
                                            ) : <div>{`${message}`}</div>
                                        }
                                        {checkAuthor(userInfo, comment.author) || checkAdmin(userInfo) ? <button className="ml-2" onClick={() => setEditing(!editing)}>Edit</button> : null}
                                    </div>
                                    <div>
                                        {reported ? <div className="pt-2 mr-1 underline ">Comment reported</div> : <ReportButton reported={reported} setReported={setReported} type={'comment'} id={comment._id} />}
                                    </div>
                                </div>
                            </div>
                            <div className="CommentDangerousHtml" dangerouslySetInnerHTML={{ __html: comment.content }}></div>
                        </div>
                    </li >
                )
            }
        </>
    ) : (
        <>
            <div className="PostPageEditComment">
                <div>{message}</div>
                <EditComment setMessage={setMessage} comment={comment} setEditing={setEditing} />
            </div>
        </>
    )
}
