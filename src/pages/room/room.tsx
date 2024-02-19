import { useEffect, useState } from 'react'
import useSocket, {
  OpCodeServer,
  OpCodeClient,
  type ResponseMessage,
  type AuthentificationPayload
} from '../../hooks/useSocket'
import useStorage from '../../hooks/useStorage'
import type { UserWs } from '../../typings/websocket'
import { Link } from 'react-router-dom'

import styles from './room.module.scss'
import Stack from '@mui/material/Stack'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import SettingsIcon from '@mui/icons-material/Settings'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import HomeIcon from '@mui/icons-material/Home'
import LinkIcon from '@mui/icons-material/Link'

interface GameSettings {
  t: number
  s: number
  choices: number
  link: string
}

interface Player {
  username?: string | null
  uuid?: string | null
  color?: string | null
  isMe?: boolean
}

function Room(): JSX.Element {
  const [settings, setSettings] = useState<GameSettings>({
    t: 10,
    s: 10,
    choices: 2,
    link: 'KfP85D8GMjgs'
  })
  const [players, setPlayers] = useState<Player[]>([
    {
      username: 'Player01',
      uuid: '1234567890',
      isMe: true
    }
  ])
  const { socketReady, send, subscribe } = useSocket()
  const { getItem, setItem, subscribe: storageSub } = useStorage()

  useEffect(() => {
    const unsub = storageSub((type, key, value) => {
      if (type === 'insertion' && key === 'user:ws') {
        const user = value as UserWs
        setPlayers((prev) => [...prev, user])
      }
    })

    return () => {
      unsub()
    }
  }, [])

  useEffect(() => {
    const unsub = subscribe(OpCodeClient.AUTHENTIFICATED, (payload: AuthentificationPayload) => {
      setItem('user:ws', payload)
    })

    return () => {
      unsub()
    }
  }, [])

  useEffect(() => {
    if (socketReady) {
      const user = getItem<UserWs>('user:ws')

      console.log('socket ready')
      send(OpCodeServer.AUTHENTIFICATION, {
        username: user?.username,
        uuid: user?.uuid
      })
    }
  }, [socketReady])

  if (!socketReady) {
    return (
      <Container>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
          <CircularProgress />
          <h3>Waiting to server...</h3>
        </Stack>
      </Container>
    )
  }

  const gameCode = 'KfP85D8GMjgs'
  return (
    <Container
      maxWidth="xs"
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}
        spacing={2}
      >

        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%', gap: '1rem' }}
        >
          <div className={styles.line}>
            <p>{settings.t}t</p>
            <p>{settings.s}s</p>
            <p>{settings.choices} choices</p>
          </div>
          <div className={[styles.line, styles.square].join(' ')}>
            <SettingsIcon />
          </div>
        </Stack>

        <Stack
          alignItems="center"
          justifyContent="space-between"
          sx={{
            width: '100%',
            backgroundColor: '#0077B8',
            borderRadius: '15px',
            padding: '15px 0'
          }}
          spacing={1.2}
        >
          {players.map((plr) => (
            <Box
              key={plr.uuid}
              className={styles.playerItem}
              sx={{
                width: '90%'
              }}
            >
              {plr.username} {plr.uuid === getItem<AuthentificationPayload>('user:ws')?.uuid ? '(You)' : ''}
            </Box>
          ))}
        </Stack>

        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%', gap: '1rem' }}
        >
          <div className={styles.line}>
            <p>{players.find((plr) => plr.isMe)?.username}</p>
          </div>
          <div className={[styles.line, styles.square].join(' ')}>
            <Link to="/"><HomeIcon /></Link>
          </div>
        </Stack>

        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%', gap: '1rem' }}
        >
          <div className={[styles.line, styles.square].join(' ')}>
            <LinkIcon />
          </div>
          <div className={styles.line}>
            <p>{settings.link}</p>
          </div>
        </Stack>
        <button className="start-game-btn"><Link to="/game" state={{ uuid: settings.link }}>START GAME</Link></button>
      </Stack>
    </Container>
  )
}

export default Room
