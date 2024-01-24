import React from 'react'
import { PostItemProps } from '../interfaces/ForumPosts'
import { Link } from 'react-router-dom'
import DateCreator from '../DateCreator/DateCreator'
export default function PostListItem({ post, index }: PostItemProps): JSX.Element {
    return (
        <li key={index} className="mb-10 shadow-standard :hover:shadow-hoverbox rounded-standard">

            <div className="text-2xl text-standard-text flex flex-col p-10">
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
        </li >
    )
}