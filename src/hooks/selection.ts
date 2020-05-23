import { useState, useEffect } from 'react'
const { ipcRenderer } = window.require('electron')

// TODO: Callback is ugly solution toenfore showing app. Find better one.
export function useSelection(cb: (text: string) => void) {
  const [selected, setSelected] = useState('')
  useEffect(() => {
    const f = (_: any, msg: string) => {
      setSelected(msg)
      cb(msg)
    }
    ipcRenderer.on('selection', f)
    return () => { ipcRenderer.off('selection', f) }
  });
  return selected;
}
