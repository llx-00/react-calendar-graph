import { useState, useEffect, useMemo } from "react"


export function useComputed<T>(callback: () => T, dependence: any[], defaultVal?: T) {
  const [_data, _set] = useState<T | undefined>(defaultVal)

  useEffect(() => {
    useMemo(callback, dependence)
    _set(callback())
  }, dependence)

  return _data
}
