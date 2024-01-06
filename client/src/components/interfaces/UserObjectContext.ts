export interface UserObject {
    login: string
    email: string
    posts: number
    comments: number
    type: "user" | "moderator" | "admin"
    lastActive: Date
    entryDate: Date
}
export interface UserContextType {
    loggedIn: boolean
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    userInfo: UserObject
    setUserInfo: React.Dispatch<React.SetStateAction<UserObject>>
}