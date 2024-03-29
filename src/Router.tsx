import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home/home'
import EndGame from './pages/end-game/end-game'
import Room from './pages/room/room'
import Game from './pages/game/game'
import Settings from './pages/settings/settings'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/end-game',
    element: <EndGame />
  },
  {
    path: '/room',
    element: <Room />
  },
  {
    path: '/game',
    element: <Game />
  }, 
  {
    path: '/settings',
    element: <Settings />
  }

])

export default router
