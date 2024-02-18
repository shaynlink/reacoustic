import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home/home'
import EndGame from './pages/end-game/end-game'
import Room from './pages/room/room'

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
  }
])

export default router
