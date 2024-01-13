import React from "react";
import { CommentListItemProps } from "../interfaces/PostComments";

export default function CommentListItem({
    comment,
    index,
}: CommentListItemProps): JSX.Element {
    const date: string = comment.date.toString().split("T")[0];
    const time: string = comment.date.toString().split("T")[1].split(".")[0];
    const commentDate = `${date} ${time}`;
    return (
        <>
            <li key={index}>
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "auto" }}>
                        <div>{comment.author}</div> <div>{commentDate}</div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: comment.content }}></div>
                </div>
            </li >
        </>
    );
}
