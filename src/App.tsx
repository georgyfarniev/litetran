import React from 'react';
import logo from './logo.svg';
import './App.css';

import { CompoundButton }  from 'office-ui-fabric-react/lib/Button';

function Header(props: any) {
  return (
    <p onClick={props.onClicked}>Suppa puppa header!222 {props.foo}</p>
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
        <CompoundButton primary  secondaryText="This is the secondary text.">
          Standard
        </CompoundButton>
        <p>
          Edit <code>src/App.tsx</code> and save to reload 222.
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
