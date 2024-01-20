import React from 'react';
import './App.scss';
import NavBar from './components/NavBar/NavBar';

function App({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <>
      <div>
        <NavBar />
        {children}
      </div>
    </>
  );
}

export default App;
