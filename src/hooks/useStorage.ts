import { useState } from 'react'

type SubscriptionType = 'insertion' | 'deletation'

interface Subscription {
  id: string
  fn: (type: SubscriptionType, key: string, value?: any) => void
}

type Unsubscription = () => void

interface StorageHook {
  setItem: <T>(key: string, value: T) => void
  getItem: <T>(key: string) => T | null
  removeItem: (key: string) => void
  subscribe: (fn: Subscription['fn']) => Unsubscription
}

export default function useStorage (): StorageHook {
  const [subscribers, setSubscribers] = useState<Subscription[]>([])

  const handleSetItem = <T>(key: string, value: T): void => {
    window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    subscribers.forEach(({ fn }) => { fn('insertion', key, value) })
  }

  const handleGetItem = <T>(key: string): T | null => {
    const result = window.localStorage.getItem(key)
    if (result === null) return null
    try {
      return JSON.parse(result)
    } catch {
      return result as unknown as T
    }
  }

  const handleRemoveItem = (key: string): void => {
    window.localStorage.removeItem(key)
    subscribers.forEach(({ fn }) => { fn('deletation', key) })
  }

  const handleSubscribe = (fn: Subscription['fn']): Unsubscription => {
    const id = Math.random().toString(36).substring(7) + Date.now()
    setSubscribers((subs) => [...subs, { id, fn }])

    return () => {
      setSubscribers((subs) => subs.filter((sub) => sub.id !== id))
    }
  }

  return {
    setItem: handleSetItem,
    getItem: handleGetItem,
    removeItem: handleRemoveItem,
    subscribe: handleSubscribe
  }
}
