import React, { useState, useEffect } from 'react';
import './App.css';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { useSelection, useTranslate } from './hooks'

function App() {
  const selected = useSelection()
  const [fromLang, setFromLang] = useState('en')
  const [toLang, setToLang] = useState('ru')

  const { result, loading } = useTranslate({
    from: 'en',
    to: 'ru',
    text: selected
  })

  const options: any[] = [
    { key: 'en', text: 'English' },
    { key: 'ru', text: 'Russian' },
  ]

  return (
    <div className="lt-app">
      <TextField multiline value={selected} />
      <div className="lt-toolbar">
        <Dropdown
          className="lt-toolbar-select"
          placeholder="Select an option"
          options={options}
          selectedKeys={[fromLang]}
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
          selectedKeys={[toLang]}
        />
        <PrimaryButton
          className="lt-toolbar-btn"
          text="Translate"
        />
      </div>
      <p>From: {fromLang}</p>
      <p>to: {toLang}</p>
      <TextField multiline value={result} />
    </div>
  )

}

export default App;
