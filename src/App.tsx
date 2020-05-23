import React, { useState, useEffect } from 'react'
import { IconButton } from 'office-ui-fabric-react/lib/Button'
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox'
import { useSelection, useTranslate, useDebounce, useLocalStorage } from './hooks/'
// import { SettingsModal } from './components/SettingsModal'
import { TranslateTextarea } from './components/TranslateTextarea'
import { LANGUAGES } from './languages'
import './App.css'
const { ipcRenderer } = window.require("electron")

export function App() {
  const [ savedState, setSavedState ] = useLocalStorage('config', {
    from: 'en',
    to: 'ru',
    text: '',
    input: '',
    translated: ''
  })

  const [ state, setState ] = useState(savedState)

  const selected = useSelection((text: string) => {
    // Enforce translation event if text unchanged
    if (text && text === state.text) {
      ipcRenderer.send('translated')
    }
  })

  const { result } = useTranslate({
    from: state.from,
    to: state.to,
    text: state.input
  })

  const swap = () => setState({ ...state, to: state.from, from: state.to })
  const clear = () => setState({ ...state, text: '', translated: '' })
  
  const setText = (text: string) => setState({ ...state, text})
  
  const setFrom = (_: any, item: any) => setState({ ...state, from: item.key })
  const setTo = (_: any, item: any) => setState({ ...state, to: item.key })

  const debouncedText = useDebounce(state.text)

  useEffect(() => () => setSavedState(state))
  useEffect(() => setState({
    ...state,
    input: selected,
    text: selected
  }), [selected])

  useEffect(() => setState({ ...state, input: debouncedText }), [debouncedText])
  useEffect(() => {
    if (state.text.length < 1) {
      clear()
    }
  }, [state.text])

  useEffect(() => {
    setState({ ...state, translated: result })
    if (result && result.length > 0) {
      ipcRenderer.send('translated')
    }
  }, [result])

  return (
    <div className="lt-app">
      {/* <SettingsModal
        visible={settingsVisible}
        onChange={setSettingsVisible}
      ></SettingsModal> */}
      <TranslateTextarea value={state.text} onChange={setText}/>
      <div className="lt-toolbar">
        <ComboBox
          className="lt-toolbar-select"
          selectedKey={state.from}
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
          selectedKey={state.to}
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
      <TranslateTextarea value={state.translated}/>
    </div>
  )
}

