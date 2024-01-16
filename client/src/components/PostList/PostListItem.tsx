import React from 'react'
import { PostItemProps } from '../interfaces/ForumPosts'
import { Link } from 'react-router-dom'
import DateCreator from '../DateCreator/DateCreator'

export default function PostListItem({ post, index }: PostItemProps): JSX.Element {
    return (
        <li key={index}>
            <Link to={{ pathname: `/posts/post/${post._id}` }}>
                <div>
                    <img style={{ width: "50px", height: "50px" }} src={`http://localhost:4000/api/getImage/${post.userProfilePicture}`} alt="None" />
                    <div>{post.author}</div>
                    <div>{post.title}</div>
                    <div>{post.category}</div>

                    <div><DateCreator date={post.date} /></div>
                </div>
            </Link>
        </li>
    )
}