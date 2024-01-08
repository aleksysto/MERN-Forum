import React from 'react'
import { PostItemProps } from '../interfaces/ForumPosts'
import { Link } from 'react-router-dom'

export default function PostListItem({ post, index }: PostItemProps): JSX.Element {

    return (
        <li key={index}>
            <Link to={{ pathname: `/posts/post/${post._id}` }}>
                <div>
                    {post.title}
                    {post.author}
                </div>
            </Link>
        </li>
    )
}