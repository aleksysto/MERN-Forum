import React from "react";
import { CommentListItemProps } from "../interfaces/PostComments";
import DateCreator from "../DateCreator/DateCreator";

export default function CommentListItem({
    comment,
    index,
}: CommentListItemProps): JSX.Element {
    return (
        <>
            <li key={index}>
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "auto" }}>
                        <div>{comment.author}</div> <div><DateCreator date={comment.date} /></div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: comment.content }}></div>
                </div>
            </li >
        </>
    );
}
