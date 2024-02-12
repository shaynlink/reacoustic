import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home/home'
import Room from './pages/room/room'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/room',
    element: <Room />
  }
])

export default router
