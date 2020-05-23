import { useState } from 'react'

export function useLocalStorage(key: string, defaultValue?: any) {
  const [ data, setData ] = useState(() => {
    const ret = localStorage.getItem(key)
    return ret ? JSON.parse(ret) : defaultValue
  })

  const setter = (value: any) => {
    setData(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [ data, setter ]
}
