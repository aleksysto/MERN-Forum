import React from 'react'
import ChatMessages from './ChatMessages'
import MessageEditor from './SendMessages'

export default function ChatBox(): JSX.Element {

    return (
        <div className="ChatBoxContainer">
            <h1>Chatbox</h1>
            <div className="ChatMessages">
                <ChatMessages />
            </div>
            <div>
                <MessageEditor />
            </div>
        </div>
    )
}