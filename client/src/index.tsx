import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
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
import commentsStore from './components/reducers/store/store';
import { Provider } from 'react-redux';

const root: Root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <Provider store={commentsStore}><App /></Provider>,
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
    path: "/posts/",
    children: [{
      path: ":category",
      element: <PostList />
    }, {
      path: "post/:id",
      element: <PostPage />
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
