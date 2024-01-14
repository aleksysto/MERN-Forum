import React, { useEffect } from 'react'
import { CommentsDispatch, useCommentsDispatch } from '../reducers/stores/store'
import { Comment } from '../interfaces/PostComments'
import { useSelector } from 'react-redux'
import { StateObject } from '../interfaces/ReducerTypes'
import { getComments } from '../reducers/actions/CommentActions'
import { Params, useParams } from 'react-router-dom'
import CommentListItem from './CommentListItem'
export default function CommentList(): JSX.Element {
    const { id }: Readonly<Params<string>> = useParams()
    const url: string = `http://localhost:4000/api/posts/${id}/comments`
    console.log(id, url)
    const dispatch: CommentsDispatch = useCommentsDispatch()
    const comments = useSelector((state: StateObject): Comment[] => { return state.printedComments })
    const message = useSelector((state: StateObject): string => { return state.message })
    useEffect((): void => {
        dispatch(getComments(url))
    }, [])

    return (
        <>
            <div style={{ margin: "auto", width: "35%" }}>
                <div>{message}</div>
                <ul style={{ listStyle: "none" }}>
                    {comments.map((comment: Comment, index) => {
                        return (
                            <li key={index}>
                                <CommentListItem comment={comment} index={index} />
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}