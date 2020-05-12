import React from 'react';
import logo from './logo.svg';
import './App.css';

function Header(props: any) {
  return (
    <p onClick={props.onClicked}>Suppa puppa header! {props.foo}</p>
  )
}

function f() {
  alert('clicked!')
}

function App() {
  return (
    <div className="App">
      <Header foo="bar" onClicked={f}></Header>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
