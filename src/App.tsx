import React, { useState, useEffect } from 'react';
import { PrimaryButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox';
import { useSelection, useTranslate } from './hooks'

import './App.css';

function App() {
  const selected = useSelection()
  const [fromLang, setFromLang] = useState('en')
  const [toLang, setToLang] = useState('ru')
  const [text, setText] = useState('')
  const [input, setInput] = useState('')

  const translate = () => setInput(text)
  const swap = () => {
    const to = toLang
    setToLang(fromLang)
    setFromLang(to)
  }

  useEffect(() => {
    setText(selected)
    setInput(selected)
  }, [selected])

  const { result, loading } = useTranslate({
    from: fromLang,
    to: toLang,
    text: input
  })

  const languages: any[] = [
    { key: 'en', text: 'English' },
    { key: 'ru', text: 'Russian' },
  ]

  return (
    <div className="lt-app">
      <TextField
        inputClassName="lt-textfield"
        multiline
        resizable={false}
        value={text}
        onChange={(_, val: any) => setText(val)}
      />
      <div className="lt-toolbar">
        <ComboBox
          className="lt-toolbar-select"
          selectedKey={fromLang}
          autoComplete="on"
          options={languages}
          onChange={(_: any, item: any) => setFromLang(item.key)}
        />
        <IconButton
          className="lt-swap-btn"
          onClick={swap}
          iconProps={{ iconName: 'Switch' }}
          title="Swap"
          ariaLabel="Swap"
        />
        <ComboBox
          className="lt-toolbar-select"
          selectedKey={toLang}
          autoComplete="on"
          options={languages}
          onChange={(_: any, item: any) => setToLang(item.key)}
        />
        <PrimaryButton
          className="lt-toolbar-btn"
          text="Translate"
          iconProps={{ iconName: 'Send' }}
          onClick={translate}
        />
      </div>
      <TextField
        inputClassName="lt-textfield"
        multiline
        resizable={false}
        value={result}
      />
    </div>
  )
}

export default App
