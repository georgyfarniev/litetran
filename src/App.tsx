import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

const { ipcRenderer } = window.require("electron")

function Header(props: any) {
  return (
    <p onClick={props.onClicked}>Suppa puppa header!111 {props.foo}</p>
  )
}

function useSelection() {
  const [selected, setSelected] = useState('')

  useEffect(() => {
    const f = (_: any, msg: string) => setSelected(msg)
    ipcRenderer.on('selection', f)
    return () => { ipcRenderer.off('selection', f) }
  })

  return selected
}

function App() {
  const selected = useSelection()
  const [fromLang, setFromLang] = useState('en')
  const [toLang, setToLang] = useState('ru')

  const options: any[] = [
    { key: 'en', text: 'English' },
    { key: 'ru', text: 'Russian' },
  ]

  return (
    <div className="lt-app">
      <TextField multiline value={selected}/>
      <div className="lt-toolbar">
        <Dropdown
        className="lt-toolbar-select"
          placeholder="Select an option"
          options={options}
          selectedKeys={[ fromLang ]}
          onChange={(ev: any) => console.dir(ev.target.value)}
        />
        <DefaultButton
          className="lt-toolbar-btn"
          text="Swap"
        />
        <Dropdown
          className="lt-toolbar-select"
          placeholder="Select an option"
          options={options}
          selectedKeys={[ toLang ]}
        />
        <PrimaryButton
          className="lt-toolbar-btn"
          text="Translate"
        />
       
      </div>
        <p>From: {fromLang}</p>
        <p>to: {toLang}</p>
        <TextField multiline />
    </div>
  )

}

export default App;
