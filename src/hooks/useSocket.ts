import { useEffect, useState } from 'react'
import Queue from '../Queue'

export interface SocketHook {
  socket: WebSocket | null
  socketReady: boolean
  send: (op: OpCodeServer, data: PayloadData) => void
  subscribe: (op: OpCodeClient, fn: any) => () => void
}

export enum OpCodeServer {
  AUTHENTIFICATION = 'authentification',
}

export enum OpCodeClient {
  AUTHENTIFICATED = 'authentificated',
}

type PayloadData = AuthentificationPayload

interface ResponseMessage<T extends PayloadData = PayloadData> {
  op: OpCodeServer
  d: T extends AuthentificationPayload
    ? AuthentificationPayload
    : PayloadData
}

interface AuthentificationPayload {
  uuid: string | null
  username?: string
  color?: string
}

interface Subscription {
  id: string
  fn: any
  op: OpCodeClient
}

export default function useSocket (): SocketHook {
  const [socket, setSocket] = useState<SocketHook['socket']>(null)
  const [socketReady, setSocketReady] = useState<boolean>(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  if (window.socketQueue === undefined) {
    window.socketQueue = new Queue<ResponseMessage>()
  }

  const handleSend = (op: OpCodeServer, data: PayloadData): void => {
    if (window.socket === undefined || window.socket?.readyState !== window.socket?.OPEN) {
      window.socketQueue.add({ op, data })
    } else {
      window.socket.send(JSON.stringify({ op, data }))
    }
  }

  const handleSubscribe = (op: OpCodeClient, fn: any): (() => void) => {
    const id = Math.random().toString(36).substring(7) + Date.now()

    setSubscriptions((subs) => [...subs, { id, op, fn }])

    return () => {
      setSubscriptions((subs) => subs.filter((sub) => sub.id !== id))
    }
  }

  useEffect(() => {
    const handleOpenListener = (): void => {
      console.log('Socket is connected')
      if (window.socket !== undefined) {
        for (const message of window.socketQueue.iterable()) {
          window.socket.send(JSON.stringify(message))
        }
      }
      setSocketReady(true)
    }

    const handleMessageListener = (event: MessageEvent): void => {
      console.log(event)
    }

    if (window.socket === undefined) {
      const socket = new WebSocket('wss://reacoustic-2fqcvdzp6q-uc.a.run.app/')
      window.socket = socket
      window.socket.addEventListener('open', handleOpenListener)
    } else {
      if (window.socket.readyState === window.socket.OPEN) {
        setSocketReady(true)
      } else {
        window.socket.addEventListener('open', handleOpenListener)
      }
    }

    window.socket.addEventListener('message', handleMessageListener)

    setSocket(window.socket)

    return () => {
      window.socket?.removeEventListener('open', handleOpenListener)
      window.socket?.removeEventListener('message', handleMessageListener)
    }
  }, [])

  return {
    socket,
    socketReady,
    send: handleSend,
    subscribe: handleSubscribe
  }
}
