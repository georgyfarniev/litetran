import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { CompoundButton }  from 'office-ui-fabric-react/lib/Button';
const { ipcRenderer } = window.require("electron")

function Header(props: any) {
  return (
    <p onClick={props.onClicked}>Suppa puppa header!111 {props.foo}</p>
  )
}

function f() {
  alert('clicked!')
}

function App() {
  const [ selected, setSelected ] = useState('')

  useEffect(() => {
    const f = (_: any, msg: string) => setSelected(msg)
    ipcRenderer.on('selection', f)
    return () => { ipcRenderer.off('selection', f) }
  })

  return (
    <div className="App">
      <Header foo="bar" onClicked={f}></Header>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <CompoundButton primary  secondaryText="2 This is the secondary text 222.">
          Standard
        </CompoundButton>
        <p>
          Selected text!!!: {selected}
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
