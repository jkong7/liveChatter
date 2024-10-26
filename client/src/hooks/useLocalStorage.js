import { useEffect, useState } from 'react'

const PREFIX = "messanger-app-"

export default function useLocalStorage(key, initialValue) {
  const prefixedKey = PREFIX + key
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey)
    if (jsonValue != null) return JSON.parse(jsonValue)
        if (typeof initialValue === 'function') {
            return initialValue()
        } else {
            return initialValue 
        }
  })

  useEffect(()=> {
    localStorage.setItem(prefixedKey, JSON.stringify(value))
  }, [prefixedKey, value])

  return [value, setValue]
}

//Cached custom hook - saves to local storage so persists across refreshes
//first checks local storage to see if value is there, otherwise set to initialValue 
//also any changes made to key or value trigger local storage saving those changes
//with useEffect

//Refresh page - data stays there - local storage! 