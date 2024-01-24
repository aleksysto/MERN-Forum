import axios, { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
export default function CategoryListItem({ category, index }: { category: string, index: number }): JSX.Element {
    const [postsNumber, setPostsNumber] = useState<number>(0)
    useEffect((): void => {
        axios.get(`http://localhost:4000/api/posts/category/${category}/count`)
            .then((res: AxiosResponse<{ count: number }>) => {
                setPostsNumber(res.data.count)
            })
            .catch((err) => {
                console.log(err)
            })
    })
    return (
        <>
            <li key={index}>
                <Link to={{ pathname: `/posts/${category}` }}>
                    <div>
                        <div>{category}</div>
                        <div>Posts: {postsNumber}</div>
                    </div>
                </Link>
            </li>
        </>
    )
}