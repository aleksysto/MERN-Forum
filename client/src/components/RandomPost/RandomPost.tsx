import React, { useEffect, useState } from 'react'
import { AggregatePostObject, PostItemProps } from '../interfaces/ForumPosts'
import { Link } from 'react-router-dom'
import DateCreator from '../DateCreator/DateCreator'
const mqtt = require('precompiled-mqtt')
const client = mqtt.connect("ws://localhost:8000/mqtt");
client.subscribe("randomPost", (err: Error) => {
    if (!err) {
        console.log("connected");
    }
});
export default function PostListItem(): JSX.Element {
    const [post, setPost] = useState<AggregatePostObject | null>(null)

    useEffect(() => {
        client.on("message", function (topic: any, message: any) {
            if (topic === "randomPost") {
                console.log(message.toString())
                const data = JSON.parse(message.toString())
                console.log(data.data)
                setPost(data.data)
            }
        })
    }, [])

    return post ? (
        <div className="RandomPost">

            <div>Random post:</div>
            <div className=" RANDOMBORDER text-2xl text-standard-text flex flex-col p-10">
                <div className="author-info flex flex-row  justify-between pb-5">
                    <Link to={{ pathname: `/user/${post.userId}` }} className="text-standard-text no-underline flex flex-row justify-between w-100">
                        <img className="max-w-[3em]" src={`http://localhost:4000/api/getImage/${post.userProfilePicture}`} alt="." />
                        <div className="ml-20">{post.author}</div>
                    </Link>
                    <div className="ml-20"><DateCreator date={post.date} /></div>
                </div>

                <div className="pt-4">
                    <Link to={{ pathname: `/posts/post/${post._id}` }} className="text-standard-text no-underline">
                        <div className="post-info flex flex-row justify-between ">
                            <div className="text-3xl align-bottom">{post.title}</div>
                            <div className="text-2xl align-bottom ">{post.category}</div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    ) : <div className="RandomPost">loading...</div>
}