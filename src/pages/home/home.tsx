import { useEffect } from 'react'
import useSocket, { OpCodeServer, OpCodeClient } from '../../hooks/useSocket'

function Home (): JSX.Element {
  const { socketReady, send, subscribe } = useSocket()

  useEffect(() => {
    const unsubscribe = subscribe(OpCodeClient.AUTHENTIFICATED, () => {
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (socketReady) {
      console.log('socket ready')
      send(OpCodeServer.AUTHENTIFICATION, {
        username: 'test',
        uuid: window.localStorage.getItem('uuid')
      })
    }
  }, [socketReady])

  if (!socketReady) {
    return <h1>{'Loading to connection...'}</h1>
  }

  return (
    <>
      <h1>{'REACOUSTIC'}</h1><br /><br />
      <div className="center">
        <button className="button">{'SOLO'}</button><br /><br />
        <button className="button">{'MULTIPLAYER'}</button><br /><br />
        <button className="buttonInput">{'JOIN ROOOM'}<br /><input className="input" placeholder={'enter code ...'}></input></button>
      </div>
    </>
  )
}

export default Home
