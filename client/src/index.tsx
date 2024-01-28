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
import PostCreator from './components/CreatePost/PostCreator';
import SearchResultsPage from './components/SearchResults/SearchResultsPage';
import AdminPanel from './components/AdminPanel/AdminPanel';
import AdminProvider from './components/contexts/AdminContext';
import AdminRoute from './components/utils/AdminRoute';
import MainPage from './components/MainPage';
import UserPage from './components/UserPage/UserPage';
import { CookiesProvider } from 'react-cookie';

const root: Root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/",
    element:
      <App>
        <MainPage />
      </App>,
  },
  {
    path: "/register",
    element:
      <App>
        <RegisterPage />
      </App>,
  },
  {
    path: "/login",
    element:
      <App>
        <LoginPage />
      </App>,
  },
  {
    path: "/account",
    element:
      <App>
        <PrivateRoute>
          <AccountPage />
        </PrivateRoute>
      </App>,
  },
  {
    path: '/user/:id',
    element:
      <App>
        <UserPage />
      </App>,
  },
  {
    path: "/search",
    element:
      <App>
        <SearchResultsPage />
      </App>
  },
  {
    path: '/admin',
    element:
      <App>
        <AdminRoute>

          <AdminProvider>
            <AdminPanel />
          </AdminProvider>

        </AdminRoute>
      </App>

  },
  {
    path: "/posts/",
    children: [{
      path: ":category",
      element:
        <App>
          <PostList />
        </App>
    },
    {
      path: ":category/create",
      element:
        <App >
          <PostCreator />
        </App >
    },
    {
      path: "post/:id",
      element:
        <Provider store={commentsStore}>
          <App>
            <PostPage />
          </App>
        </Provider>
    }]
  }
]);

root.render(
  <React.StrictMode>
    <CookiesProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </CookiesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
