// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite/client" />
import type { Socket } from 'socket.io-client'

declare global {
  interface Window {
    socket?: Socket
  }
}
