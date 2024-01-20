import React, { useEffect, useState } from 'react'
import { ReportedPanelProps } from '../../interfaces/AdminReducerTypes'
import DateCreator from '../../DateCreator/DateCreator'
import { CommentObject } from '../../interfaces/PostComments'
import { UserObject } from '../../interfaces/UserObjectContext'
import { PostObject } from '../../interfaces/ForumPosts'
import useConfirm from '../../hooks/useConfirm'
import DeleteButton from '../../utils/DeleteButton'
import useAdminReducer from '../../reducers/AdminReducer'
import axios, { AxiosError, AxiosResponse } from 'axios'
export default function ReportedPanel({ report, index, dispatch }: ReportedPanelProps): JSX.Element {
    const { action, setAction, confirm, setConfirm } = useConfirm()
    const [handled, setHandled] = useState<string | null>(null)
    const type: string = report.type
    const reportedObject: PostObject | UserObject | CommentObject = report.reportedObject
    function createUrl(type: string): string {
        switch (type) {
            case 'comment':
                return `http://localhost:4000/api/comments/id/${reportedObject._id}`
            case 'post':
                return `http://localhost:4000/api/posts/id/${reportedObject._id}`
            case 'user':
                return `http://localhost:4000/api/users/id/${reportedObject._id}`
            default:
                return ''
        }
    }
    function handleApprove() {
        axios.delete(`http://localhost:4000/api/reports/${report._id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse<{ message: string }>): void => {
                dispatch({ type: 'setMessage', payload: { message: "Report dropped" } })
                dispatch({ type: 'removeReport', payload: { id: report._id } })
                setHandled("Approved")
            })
            .catch((err: AxiosError<{ message: string }>): void => {
                err.response
                    ? dispatch({ type: 'setMessage', payload: { message: err.response.data.message } })
                    : dispatch({ type: 'setMessage', payload: { message: 'Server Error' } })
            })
    }
    function handleDelete() {
        const url: string = createUrl(type)
        axios.delete(url, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse<{ message: string }>): void => {
                dispatch({ type: 'setMessage', payload: { message: "Comment deleted" } })
                dispatch({ type: 'removeComment', payload: { id: reportedObject._id } })
                setHandled('Deleted')
            })
            .catch((err: AxiosError<{ message: string }>): void => {
                err.response
                    ? dispatch({ type: 'setMessage', payload: { message: err.response.data.message } })
                    : dispatch({ type: 'setMessage', payload: { message: 'Server Error' } })
            })
        axios.delete(`http://localhost:4000/api/reports/${report._id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then((res: AxiosResponse<{ message: string }>): void => {
                dispatch({ type: 'setMessage', payload: { message: "Report dropped" } })
                dispatch({ type: 'removeReport', payload: { id: report._id } })
            })
            .catch((err: AxiosError<{ message: string }>): void => {
                err.response
                    ? dispatch({ type: 'setMessage', payload: { message: err.response.data.message } })
                    : dispatch({ type: 'setMessage', payload: { message: 'Server Error' } })
            })
    }
    return handled ? (
        <>
            <div>
                {handled}
            </div>
        </>
    ) : (
        <>
            <li>
                <div>
                    <div>Reported on: <DateCreator date={report.reportedOn} /></div>
                    <div>
                        <button onClick={handleApprove}>Approve</button>
                        <DeleteButton {...{ action, setAction, confirm, setConfirm, handleAction: handleDelete }} />
                    </div>
                    {
                        'login' in reportedObject ? (
                            <div>
                                <div><img src={`http://localhost:4000/api/getImage/${reportedObject.profilePicture}`} alt="" /></div>
                                <div>Login: {reportedObject.login}</div>
                                <div>Email: {reportedObject.email}</div>
                                <div>Last active: <DateCreator date={reportedObject.lastActive} /></div>
                                <div>Created: <DateCreator date={reportedObject.entryDate} /></div>
                                <div>Posts: {reportedObject.posts}</div>
                                <div>Comments: {reportedObject.comments}</div>
                            </div>
                        ) : 'title' in reportedObject ? (
                            <div>
                                <div><div>{reportedObject.author}</div><div><DateCreator date={reportedObject.date} /></div></div>
                                <h2>{reportedObject.title}</h2>
                                <div><div dangerouslySetInnerHTML={{ __html: reportedObject.content }}></div></div>
                            </div>
                        ) : (
                            <div>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "auto" }}>
                                        <div>{reportedObject.author}</div> <div><DateCreator date={reportedObject.date} /></div>
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: reportedObject.content }}></div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </li>
        </>
    )
}