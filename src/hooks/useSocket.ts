import { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'

const OP_CODE_TO_SERVER = {
  AUTHENTIFICATION: 'authentification'
}

export interface Sockethook {
  socket: Socket | null
  socketReady: boolean
}

interface Subscription {
  id: string
  fn: (data: any) => void
  unsubscribe: () => void
  type: string
}

export default function useSocket (): Sockethook {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [socketReady, setSocketReady] = useState(false)
  const [subscribers, setSubscribers] = useState<Subscription[]>([])

  const handleResponseSubscription = (type: Subscription['type']): ((fn: Subscription['fn']) => void) => {
    return (fn: Subscription['fn']) => {
      const id = Math.random().toString(36).substring(2, 9)

      const unsubscribe = (): void => {
        setSubscribers((subs) => subs.filter((sub) => sub.id !== id))
      }

      setSubscribers((subs) => [...subs, { id, fn, unsubscribe, type }])
    }
  }

  useEffect(() => {
    const handlesocketConnect = (): void => {
      console.log('Socket connected')
      setSocketReady(true)
    }

    const handleEventListener = (type: Subscription['type']) => {
      return (message: any) => {
        console.log('[%s] Message received ->', type, message)
        subscribers
          .filter((sub) => sub.type === type)
          .forEach(({ fn }) => { fn(message) })
      }
    }

    const authentificationHandler = handleEventListener(OP_CODE_TO_SERVER.AUTHENTIFICATION)

    const handleMessageListener = (messages: any): void => {
      console.log('Message received ->', messages)
    }

    if (window.socket !== undefined) {
      if (window.socket.connected) {
        setSocketReady(true)
      } else {
        window.socket.on('connect', handlesocketConnect)
      }
      window.socket.on('message', authentificationHandler)
      setSocket(window.socket)
    } else {
      const socket = io('https://reacoustic-2fqcvdzp6q-uc.a.run.app/')
      window.socket = socket
      window.socket.on('connect', handlesocketConnect)
      setSocket(socket)
    }

    window.socket.on('message', handleMessageListener)

    return () => {
      window.socket?.off('connect', handlesocketConnect)
      window.socket?.off('message', handleMessageListener)
    }
  }, [])

  return {
    socket,
    socketReady
  }
}
