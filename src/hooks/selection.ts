import { useState, useEffect } from 'react'
const { ipcRenderer } = window.require('electron')

export function useSelection() {
  const [selected, setSelected] = useState('')
  useEffect(() => {
    const f = (_: any, msg: string) => setSelected(msg)
    ipcRenderer.on('selection', f)
    return () => { ipcRenderer.off('selection', f) }
  });
  return selected;
}
