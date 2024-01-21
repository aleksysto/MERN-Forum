import { Navigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

export default function AdminRoute({ children }: { children: JSX.Element }): JSX.Element {
    const { userInfo } = useUserContext()
    return userInfo.type === 'moderator' || userInfo.type === 'admin' ? children : <Navigate to="/" />
}