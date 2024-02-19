import { useEffect, useState } from 'react'

export interface SocketHook {
  socket: WebSocket | null
  socketReady: boolean
  send: (op: OpCodeServer, data: PayloadData) => void
  subscribe: <T extends ResponseMessage<PayloadData>>(op: T['op'], fn: (payload: T['d']) => void) => (() => void)
}

export enum OpCodeServer {
  AUTHENTIFICATION = 'authentification',
}

export enum OpCodeClient {
  AUTHENTIFICATED = 'authentificated',
}

type PayloadData = AuthentificationPayload

export interface ResponseMessage<T extends PayloadData = PayloadData> {
  op: OpCodeClient
  d: T extends AuthentificationPayload
    ? AuthentificationPayload
    : PayloadData
}

export interface AuthentificationPayload {
  uuid?: string | null
  username?: string | null
  color?: string | null
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

  const handleSend = (op: OpCodeServer, data: PayloadData): void => {
    if (window.socket === undefined) {
      console.log('Socket is not connected')
      return
    }
    window.socket.send(JSON.stringify({ op, d: data }))
    console.log('[WS]: Client -> Server:', { op, d: data })
  }

  const handleSubscribe = <T extends ResponseMessage<PayloadData>>(op: T['op'], fn: (payload: T['d']) => void): (() => void) => {
    const id = Math.random().toString(36).substring(7) + Date.now()

    setSubscriptions(() => [{ id, op, fn }, ...subscriptions])

    return () => {
      setSubscriptions((subs) => subs.filter((sub) => sub.id !== id))
    }
  }

  const handleMessageListener = (event: MessageEvent<string>): void => {
    const payload: ResponseMessage = JSON.parse(event.data)
    console.log('[WS]: Server -> Client:', payload)

    for (const { fn } of subscriptions.filter((sub) => sub.op === payload.op)) {
      fn(payload.d)
    }
  }

  const handleOpenListener = (): void => {
    console.log('Socket is connected')
    setSocketReady(true)
  }

  useEffect(() => {
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
