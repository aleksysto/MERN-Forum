import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RegisterPage from './components/RegisterPage/RegisterPage';
import LoginPage from './components/LoginPage/LoginPage';
import UserProvider from './components/contexts/UserContext';
import AccountPage from './components/AccountPage/AccountPage';
import PrivateRoute from './components/utils/PrivateRoute';
import PostList from './components/PostList/PostList';
import PostPage from './components/PostPage/PostPage';
import commentsStore from './components/reducers/stores/store';
import { Provider } from 'react-redux';
import CommentEditor from './components/CreateComment/CommentEditor';
import PostCreator from './components/CreatePost/PostCreator';
import SearchResultsPage from './components/SearchResults/SearchResultsPage';
import AdminPanel from './components/AdminPanel/AdminPanel';
import AdminProvider from './components/contexts/AdminContext';

const root: Root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/account",
    element: <PrivateRoute><AccountPage /></PrivateRoute>,
  },
  {
    path: "/search",
    element: <SearchResultsPage />
  },
  {
    path: '/admin',
    element: (
      <>
        <AdminProvider>
          <AdminPanel />
        </AdminProvider>
      </>
    )
  },
  {
    path: "/posts/",
    children: [{
      path: ":category",
      element: <PostList />
    },
    {
      path: ":category/create",
      element: <PostCreator />
    },
    {
      path: "post/:id",
      element: <Provider store={commentsStore}><PostPage /> </Provider>
    }]
  }
]);

root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
