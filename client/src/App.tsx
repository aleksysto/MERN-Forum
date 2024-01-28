import React, { useEffect } from 'react';
import './App.scss';
import NavBar from './components/NavBar/NavBar';
import TopUsersList from './components/LeftSidePanel/TopUsersList';
import ChatBox from './components/Chatbox/Chatbox';
import { useCookies } from 'react-cookie';

function App({ children }: { children: JSX.Element }): JSX.Element {
  const [cookies, setCookie] = useCookies()
  useEffect(() => {
    if (!cookies.visits) {
      setCookie('visits', 0)
    }
    setCookie('visits', cookies.visits + 1)
  }, [])

  return (
    <>
      <div className="App">
        <NavBar />
        <div className="Body">
          <TopUsersList />
          <ChatBox />
          {children}

        </div>
      </div>
    </>
  );
}

export default App;
