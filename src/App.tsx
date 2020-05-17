import React, { useState, useEffect, useRef } from 'react';
import { PrimaryButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox';
import { useSelection, useTranslate } from './hooks'
import './App.css';

function Toolbar(props: any) {
  return (
    <div className="lt-input-toolbar" onClick={props.onClick}>
      {props.children}
    </div>
  )
}

function Input(props: any) {
  const ref = useRef(null)

  return (
    <div className="lt-input-container">
      <TextField
        inputClassName="lt-textfield"
        multiline
        resizable={false}
        value={props.value}
        onChange={(_, val: any) => props.onChange(val)}
        componentRef={ref}
      />
      <Toolbar onClick={() => ref?.current?.focus()}>
        <IconButton
          iconProps={{ iconName: 'Play' }}
          title="Play"
          ariaLabel="Play"
        />
        <IconButton
          iconProps={{ iconName: 'Copy' }}
          title="Copy"
          ariaLabel="Copy"
        />
      </Toolbar>
    </div>
  )
}

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
      <Input value={text} onChange={setText}></Input>
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
