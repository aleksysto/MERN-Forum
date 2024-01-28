import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext';
import DateCreator from '../DateCreator/DateCreator';
import DeleteButton from '../utils/DeleteButton';
import ChatMessage from './ChatMessage';
// import mqtt from "precompiled-mqtt";
const mqtt = require('precompiled-mqtt')
const client = mqtt.connect("ws://localhost:8000/mqtt");
client.subscribe("dataMessages", (err: Error) => {
    if (!err) {
        console.log("subscribed to messages");
    }
});

export default function ChatMessages(): JSX.Element {
    const [messages, setMessages] = useState<Array<any>>([])
    const { userInfo } = useUserContext()

    useEffect(() => {
        client.publish("getMessages", "")
    }, [])
    useEffect(() => {
        client.on("message", (topic: any, message: any) => {
            if (topic === "dataMessages") {
                const data = JSON.parse(message.toString())
                console.log(data)
                setMessages(data.data)
            }
        })
    }, [])
    console.log(messages)
    return (
        <>
            {
                messages ? messages.map((message, index) => {
                    return (
                        <ChatMessage message={message} />
                    )
                }) : <div>loading...</div>
            }
        </>
    )
}