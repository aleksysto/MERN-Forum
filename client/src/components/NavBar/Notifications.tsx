import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext';
import DateCreator from '../DateCreator/DateCreator';
const mqtt = require('precompiled-mqtt')
const client = mqtt.connect("ws://localhost:8000/mqtt");
client.subscribe("dataNotifs", (err: Error) => {
    if (!err) {
        console.log("subscribed to notifs");
    }
});
export default function Notifications() {
    const { userInfo } = useUserContext()
    const [display, setDisplay] = useState<boolean>(false)
    const [notifs, setNotifs] = useState([])
    function deleteNotif(id: string) {
        client.publish("deleteNotifs", JSON.stringify({ id: id, token: localStorage.getItem('token'), userId: userInfo._id }))
    }

    useEffect(() => {
        client.on("message", (topic: any, message: any) => {
            if (topic === "dataNotifs") {
                const data = JSON.parse(message.toString())
                console.log(data)
                setNotifs(data.data)
            }
        })
    }, [])
    useEffect(() => {
        client.publish("getNotifs", JSON.stringify({ userId: userInfo._id }))
    }, [display])
    return (
        <>
            <div className="DropDown">
                <div>
                    <button onClick={() => setDisplay(!display)}>
                        &#9757;
                    </button>
                </div>
                <div className="DropDownNotifs">
                    {
                        display ?

                            notifs.map((notif: any) => {
                                return (
                                    <>
                                        <div className="NotifItem">
                                            <button onClick={() => { deleteNotif(notif._id) }}>X</button>
                                            <Link to={{ pathname: `/posts/post/${notif.postId}` }}>
                                                <div><DateCreator date={notif.date} /></div>
                                                <div>{notif.from} commented on your post: </div>
                                                <div>{notif.postTitle}</div>
                                            </Link>
                                        </div>
                                    </>
                                )
                            })

                            : null
                    }
                </div>
            </div>
        </>
    )

}