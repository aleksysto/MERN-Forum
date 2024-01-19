import React, { useEffect, useState } from 'react'
import Users from './Users'
import Posts from './Posts'
import Comments from './Comments'
import Reported from './Reported'

export default function CurrentList({ select }: { select: string }) {
    const [list, setList] = useState<JSX.Element | null>(null)

    useEffect(() => {
        switch (select) {
            case 'users':
                setList(<Users />)
                break;
            case 'posts':
                setList(<Posts />)
                break;
            case 'comments':
                setList(<Comments />)
                break;
            case 'reported':
                setList(<Reported />)
                break;
            default:
                setList(null)
                break;
        }
    }, [select])

    return (
        <>
            {list}
        </>
    )
}