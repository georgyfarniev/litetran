import { useState, useEffect } from 'react'

export function useDebounce(value: any, timeoutMs: number = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), timeoutMs)
    return () => clearTimeout(handle)
  }, [value])

  return debounced
}
