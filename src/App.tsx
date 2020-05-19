import React, { useState, useEffect } from 'react'
import { PrimaryButton, IconButton } from 'office-ui-fabric-react/lib/Button'
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox'
import { useSelection, useTranslate, useDebounce } from './hooks'
import './App.css'
import { SettingsModal } from './components/SettingsModal'
import { TranslateTextarea } from './components/TranslateTextarea'
import * as directions from './directions.json'


function App() {
  const selected = useSelection()
  const [fromLang, setFromLang] = useState('en')
  const [toLang, setToLang] = useState('ru')
  const [text, setText] = useState('')
  const [settingsVisible, setSettingsVisible] = useState(false)

  const swap = () => {
    const to = toLang
    setToLang(fromLang)
    setFromLang(to)
  }

  useEffect(() => {
    setText(selected)
  }, [selected])

  const debouncedText = useDebounce(text)

  const { result, loading } = useTranslate({
    from: fromLang,
    to: toLang,
    text: debouncedText
  })


  const languages: any = directions.default

  return (
    <div className="lt-app">
      <SettingsModal
        visible={settingsVisible}
        onChange={setSettingsVisible}
      ></SettingsModal>
      <TranslateTextarea value={text} onChange={setText}></TranslateTextarea>
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
        <IconButton
          className="lt-config-btn"
          onClick={() => setSettingsVisible(true)}
          iconProps={{ iconName: 'Settings' }}
          title="Settings"
          ariaLabel="Settings"
        />
      </div>
      <TranslateTextarea value={result} readOnly></TranslateTextarea>
    </div>
  )
}

export default App
