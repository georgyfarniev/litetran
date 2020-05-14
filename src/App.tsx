import React, { useState, useEffect } from 'react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { useSelection, useTranslate } from './hooks'

import './App.css';

function App() {
  const selected = useSelection()
  const [fromLang, setFromLang] = useState('en')
  const [toLang, setToLang] = useState('ru')
  const [text, setText ] = useState('')
  const [input, setInput] = useState('')

  const translate = () => setInput(text)

  useEffect(() => {
    setText(selected)
    setInput(selected)
  }, [ selected ])

  const { result, loading } = useTranslate({
    from: 'en',
    to: 'ru',
    text: input
  })

  const options: any[] = [
    { key: 'en', text: 'English' },
    { key: 'ru', text: 'Russian' },
  ]

  return (
    <div className="lt-app">
      <TextField
        multiline
        value={text}
        onChange={(ev) => setText(ev.target!.value)}
      />
      <p>from: {fromLang}</p>
      <div className="lt-toolbar">
        <Dropdown
          className="lt-toolbar-select"
          placeholder="Select an option"
          options={options}
          onChange={(ev: any) => console.dir(ev)}
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
          onClick={translate}
        />
      </div>
      <TextField multiline value={result} />
    </div>
  )
}

export default App;
