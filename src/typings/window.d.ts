import type Queue from './Queue'

export declare global {
  interface Window {
    socket?: WebSocket
    socketQueue: Queue
  }
}
