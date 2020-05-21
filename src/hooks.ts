import { useState, useEffect } from 'react'
import useAxios from '@use-hooks/axios'

const { ipcRenderer } = window.require("electron")

export function useDebounce(value: any, timeoutMs: number = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), timeoutMs)
    return () => clearTimeout(handle)
  }, [ value ])

  return debounced
}

export function useSelection() {
  const [selected, setSelected] = useState('')

  useEffect(() => {
    const f = (_: any, msg: string) => setSelected(msg)
    ipcRenderer.on('selection', f)
    return () => { ipcRenderer.off('selection', f) }
  })

  return selected
}

const TRANSLATE_API = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
const KEY = 'trnsl.1.1.20200513T162329Z.67f4bd4475e32475.a1863f6d5af5320919b4bab95fc2e78c709d5748'

export interface IUseTranslateOpts {
  from: string
  to: string
  text: string
}

export interface IUseTranslateResponse {
  result: string
  loading: boolean
  error: boolean
}

export function useTranslate(opts: IUseTranslateOpts): IUseTranslateResponse {
  const { response, loading, error } = useAxios({
    url: TRANSLATE_API,
    method: 'GET',
    options: {
      params: {
        key: KEY,
        text: opts.text,
        lang: `${opts.from}-${opts.to}`
      }
    },
    trigger: [ opts.text, opts.from, opts.to ],
    forceDispatchEffect: () => !!opts.text
  })

  return {
    result: response?.data?.text?.[0],
    loading,
    error: !!error
  }
}