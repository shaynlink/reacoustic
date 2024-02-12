import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home/home'
import EndGame from './pages/end-game/end-game'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/end-game',
    element: <EndGame />
  }
])

export default router
