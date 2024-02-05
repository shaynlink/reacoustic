import { createBrowserRouter } from 'react-router-dom';
import Accueil from './components/accueil';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Accueil />
  },
]);
export default router
