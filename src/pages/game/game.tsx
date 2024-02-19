import { useState } from 'react'
import Timer from '../../components/Timer/Timer'
import axios from 'axios'
import useSWR from 'swr'

interface Track {
  name: string
  artist: string
}

const fetcher = (url: string, playlist: string) => {
  return axios.get(url, {
    params: {
      playlist
    }
  }).then((res) => res.data)
}

function Game(): JSX.Element {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const maxTime = 900
  const playlist = 'https://www.youtube.com/playlist?list=PL4fGSI1pDJn7bK3y1Hx-qpHBqfr6cesNs'
  const { data, error, isLoading } = useSWR('/getSongs', (url) => fetcher(url, playlist))


  const handleTimeout = () => {
    console.log('Time is out')
  }

  return (
    <div className="game">
      <Timer key={round} maxTime={maxTime} onTimeout={handleTimeout} />
      <div className="score-text">{score} pt</div>
      <div className="track-list">
        {tracks.map((track, index) => (
          <button key={index} className="track-button">
            {track.name} - {track.artist}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Game
