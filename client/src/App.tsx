import React from 'react';
import './App.scss';
import NavBar from './components/NavBar/NavBar';
import TopUsersList from './components/LeftSidePanel/TopUsersList';
import ChatBox from './components/Chatbox/Chatbox';

function App({ children }: { children: JSX.Element }): JSX.Element {
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
