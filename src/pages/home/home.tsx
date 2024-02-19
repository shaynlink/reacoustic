import { Link } from 'react-router-dom'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'

function Home(): JSX.Element {
  return (
    <Container>
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={10}
        sx={{ minHeight: '100vh' }}
      >
        <h1>REACOUSTIC</h1>

        <Stack alignItems="center" spacing={2}>
          <button className="button">SOLO</button>
          <button className="button"><Link to="room">MULTIPLAYER</Link></button>
          <Box sx={{ paddingTop: '1rem' }}>
            <button className="buttonInput">JOIN ROOOM<input className="input" placeholder={'enter code ...'}></input></button>
          </Box>
        </Stack>

      </Stack>
    </Container>
  )
}

export default Home
