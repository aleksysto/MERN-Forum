export interface UploadPost{
    title: string
    author: string
    content: string
}

export interface PostObject {
    _id: string
    title: string
    content: string
    author: string
    date: Date
}

export interface PostItemProps {
    post: PostObject
    index: number
}