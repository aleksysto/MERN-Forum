import React, { useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import DateCreator from '../DateCreator/DateCreator';
import DeleteButton from '../utils/DeleteButton';
const mqtt = require('precompiled-mqtt')
const client = mqtt.connect("ws://localhost:8000/mqtt");
client.subscribe("deleteMessages", (err: Error) => {
    if (!err) {
        console.log("subscribed to messages");
    }
});
export default function ChatMessage({ message }: any) {
    const { userInfo } = useUserContext()
    const [action, setAction] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    function handleDelete() {
        const deleteData: any = {
            token: localStorage.getItem('token'),
            _id: message._id,
            userId: message.userId
        }
        client.publish("deleteMessages", JSON.stringify(deleteData))
    }



    return (
        <>
            <div className={userInfo._id === message.userId ? "OwnMessage" : "Message"}>
                <div className="MessageAuthorBox">
                    <div className="MessageAuthorPicture"> <img src={`http://localhost:4000/api/getImage/${message.userProfilePicture}`} alt="" /></div>
                    <div className="MessageAuthor">{message.author}</div>
                    <div className="MessageDate"><DateCreator date={message.date} /></div>
                    <div> {userInfo.type === 'admin' || userInfo.type === 'moderator' || userInfo._id === message.userId ? <DeleteButton action={action} setAction={setAction} confirm={confirm} setConfirm={setConfirm} handleAction={handleDelete} /> : null} </div>
                </div>
                <div className="MessageContent"
                    dangerouslySetInnerHTML={{ __html: message.content }}>
                </div>
            </div>
        </>
    )
}