import React, { useState, useEffect } from 'react'
import { IconButton } from 'office-ui-fabric-react/lib/Button'
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox'
import { useSelection, useTranslate, useDebounce } from './hooks/'
// import { SettingsModal } from './components/SettingsModal'
import { TranslateTextarea } from './components/TranslateTextarea'
import { LANGUAGES } from './languages'
import './App.css'
const { ipcRenderer } = window.require("electron")

function App() {
  const selected = useSelection()
  const [fromLang, setFromLang] = useState('en')
  const [toLang, setToLang] = useState('ru')
  const [text, setText] = useState('')
  const [input, setInput] = useState('')
  const [translated, setTranslated] = useState('')

  const swap = () => {
    const to = toLang
    setToLang(fromLang)
    setFromLang(to)
  }

  const clear = () => {
    setText('')
    setTranslated('')
  }

  const setFrom = (_: any, item: any) => setFromLang(item.key)
  const setTo = (_: any, item: any) => setToLang(item.key)

  const debouncedText = useDebounce(text)

  useEffect(() => {
    setInput(selected)
    setText(selected)
  }, [selected])

  useEffect(() => setInput(debouncedText), [debouncedText])

  const { result } = useTranslate({
    from: fromLang,
    to: toLang,
    text: input
  })

  useEffect(() => {
    setTranslated(result)
    if (result && result.length > 0) {
      ipcRenderer.send('translated', result)
    }
  }, [result])

  return (
    <div className="lt-app">
      {/* <SettingsModal
        visible={settingsVisible}
        onChange={setSettingsVisible}
      ></SettingsModal> */}
      <TranslateTextarea value={text} onChange={setText}/>
      <div className="lt-toolbar">
        <ComboBox
          className="lt-toolbar-select"
          selectedKey={fromLang}
          autoComplete="on"
          options={LANGUAGES}
          onChange={setFrom}
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
          options={LANGUAGES}
          onChange={setTo}
        />
        <IconButton
          className="lt-config-btn"
          onClick={clear}
          iconProps={{ iconName: 'Delete' }}
          title="Delete"
          ariaLabel="Delete"
        />
        {/* <IconButton
          className="lt-config-btn"
          onClick={() => setSettingsVisible(true)}
          iconProps={{ iconName: 'Settings' }}
          title="Settings"
          ariaLabel="Settings"
        /> */}
        
      </div>
      <TranslateTextarea value={translated}/>
    </div>
  )
}

export default App
