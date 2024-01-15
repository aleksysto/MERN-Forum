import React, { useEffect } from 'react'
import { CommentsDispatch, useCommentsDispatch } from '../reducers/stores/store'
import { commentsSetPage } from '../reducers/actions/CommentActions'

export default function PageButtons({ length, pageRef }: { length: number, pageRef: React.MutableRefObject<number> }): JSX.Element {
    const helperArray = new Array(length).fill(null)
    const dispatch: CommentsDispatch = useCommentsDispatch()
    function handleClickPage(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault()
        const target = e.target as HTMLButtonElement
        pageRef.current = parseInt(target.value)
        dispatch(commentsSetPage(pageRef.current))
    }
    function handlePrevPage(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault()
        if (pageRef.current > 0) {
            pageRef.current = pageRef.current - 1
            dispatch(commentsSetPage(pageRef.current))
        }
    }
    function handleNextPage(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault()
        if (pageRef.current < length - 1) {
            pageRef.current = pageRef.current + 1
            dispatch(commentsSetPage(pageRef.current))
        }
    }
    return (
        <>
            {pageRef.current <= 0 ? null : <button onClick={handlePrevPage}>{'<'}</button>}
            {helperArray.map((el: null, idx: number): JSX.Element => {
                return (
                    <button key={idx} value={idx} onClick={handleClickPage}>{idx + 1}</button>
                )
            })}
            {pageRef.current >= length - 1 ? null : <button onClick={handleNextPage}>{'>'}</button>}
        </>
    )
}