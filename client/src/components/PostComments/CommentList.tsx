import React, { useEffect, useRef } from 'react'
import { CommentsDispatch, useCommentsDispatch } from '../reducers/stores/store'
import { AggregateCommentObject } from '../interfaces/PostComments'
import { useSelector } from 'react-redux'
import { StateObject } from '../interfaces/ReducerTypes'
import { getComments } from '../reducers/actions/CommentActions'
import { Params, useParams } from 'react-router-dom'
import CommentListItem from './CommentListItem'
import * as uuid from 'uuid';
import PageButtons from './PageButtons'
export default function CommentList(): JSX.Element {
    const { id }: Readonly<Params<string>> = useParams()
    const url: string = `http://localhost:4000/api/posts/${id}/comments`
    const dispatch: CommentsDispatch = useCommentsDispatch()
    const comments = useSelector((state: StateObject): AggregateCommentObject[] => { return state.printedComments })
    const commentsLength = useSelector((state: StateObject): number => { return state.comments.length })
    const message = useSelector((state: StateObject): string => { return state.message })
    const pageRef = useRef<number>(0)
    useEffect((): void => {
        dispatch(getComments(url))
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <div className="text-standard-text text-1xl pt-4">{message}</div>
            <ul className="mt-5" style={{ listStyle: "none" }}>
                {comments.map((comment: AggregateCommentObject, index: number): JSX.Element => {
                    return (
                        <CommentListItem comment={comment} index={index} key={uuid.v4()} />
                    )
                })}
            </ul>
            <div className="flex flex-row text-center"> <div className="CommentPageButtons"><PageButtons length={Math.ceil(commentsLength / 10)} pageRef={pageRef} /></div></div>
        </>
    )
}