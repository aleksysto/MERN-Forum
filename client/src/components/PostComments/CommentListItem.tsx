import React, { useState } from "react";
import { CommentListItemProps } from "../interfaces/PostComments";
import DateCreator from "../DateCreator/DateCreator";
import { checkAdmin, checkAuthor } from "../utils/CheckPermissions";
import { useUserContext } from "../contexts/UserContext";
import EditComment from "../CreateComment/EditComment";
export default function CommentListItem({
    comment,
    index,
}: CommentListItemProps): JSX.Element {
    const { userInfo } = useUserContext();
    const [editing, setEditing] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    return !editing ? (
        <>
            <li key={index}>
                <div>
                    {checkAuthor(userInfo, comment.author) || checkAdmin(userInfo) ? <button onClick={() => setEditing(!editing)}>edit</button> : null}
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "auto" }}>
                        <div>{comment.author}</div><img style={{ width: "30px", height: "30px" }} src={`http://localhost:4000/api/getImage/${comment.userProfilePicture}`} alt="" /> <div><DateCreator date={comment.date} /></div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: comment.content }}></div>
                </div>
            </li >
        </>
    ) : (
        <>
            <div>{message}</div>
            <EditComment setMessage={setMessage} comment={comment} setEditing={setEditing} />
        </>
    )
}
