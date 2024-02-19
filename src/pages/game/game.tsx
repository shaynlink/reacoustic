import { useLocation } from 'react-router-dom'

import Container from '@mui/material/Container'

export default function Game(): JSX.Element {
  const { state } = useLocation()
  console.log(state)

  return (
    <Container>
      <Loaderbar />
    </Container>
  )
}
