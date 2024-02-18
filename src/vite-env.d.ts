// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite/client" />
import type Queue from './Queue'

export declare global {
  interface Window {
    socket?: WebSocket
    socketQueue: Queue
  }
}
