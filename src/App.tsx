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
        <Dropdown
          className="lt-toolbar-select"
          placeholder="Select an option"
          options={languages}
          selectedKey={fromLang}
          onChange={(_: any, item: any) => setFromLang(item.key)}
        />
        <DefaultButton
          className="lt-toolbar-btn"
          text="Swap"
          onClick={swap}
        />
        <Dropdown
          className="lt-toolbar-select"
          placeholder="Select an option"
          options={languages}
          selectedKey={toLang}
          onChange={(_: any, item: any) => setToLang(item.key)}

        />
        <PrimaryButton
          className="lt-toolbar-btn"
          text="Translate"
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
