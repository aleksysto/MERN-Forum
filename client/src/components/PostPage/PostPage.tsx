import React, { useState } from 'react'

import PostPageGenerator from './PostPageGenerator'
import CommentList from '../PostComments/CommentList'
import CommentCreator from '../CreateComment/CommentCreator'

export default function PostPage(): JSX.Element {
    const [error, setError] = useState<string | null>(null)
    return error ? (
        <>
            <div className="text-standard-text text-4xl">{error}</div>
        </>
    ) : (
        <>
            <div className="PostPage text-standard-text flex flex-col">
                <div className="PostPagePostContainer">
                    <PostPageGenerator setError={setError} />
                </div>
                <div className="CommentListPostPage">
                    <CommentList />
                </div>
                <div className="CommentCreatorPostPage">
                    <CommentCreator />
                </div>
            </div>

        </>
    )
}