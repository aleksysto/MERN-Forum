import React from 'react';
import './App.scss';
import NavBar from './components/NavBar/NavBar';
import TopUsersList from './components/LeftSidePanel/TopUsersList';

function App({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <>
      <div className="App">
        <NavBar />
        <TopUsersList />
        {children}
      </div>
    </>
  );
}

export default App;
