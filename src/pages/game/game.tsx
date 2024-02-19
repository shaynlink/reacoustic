import { useState, useEffect } from 'react'
import Timer from '../../components/Timer/Timer'
import Player from '../../components/Player/Player'
import axios from 'axios'
import useSWR from 'swr'

interface Track {
  kind: string
  etag: string
  id: string
  contentDetails: {
    videoId: string
    videoPublishedAt: string
  },
  parsedTitlle: string
  choosed?: boolean
}

const fetcher = (url: string, playlist: string) => {
  return axios.get('https://reacoustic-2fqcvdzp6q-uc.a.run.app' + url, {
    params: {
      playlist
    }
  }).then((res) => res.data)
}

function Game(): JSX.Element {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [startTime, setStartTime] = useState(false)
  const [usedTracks, setUsedTracks] = useState<Track[]>([])
  const maxTime = 30
  const playlist = 'PL4fGSI1pDJn7bK3y1Hx-qpHBqfr6cesNs'
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [songUrl, setSongUrl] = useState<string>('')
  const { data, error, isLoading } = useSWR('/getSongs', async (url) => await fetcher(url, playlist))

  const handleTracks = () => {
    // Get 4 random tracks
    const randomTracks = data
      .filter((trk: Track) => !usedTracks.some((usedTrk) => usedTrk.id === trk.id))
      .sort(() => 0.5 - Math.random()).slice(0, 4)
    const trkIndex = Math.floor(Math.random() * 4)
    const trk = randomTracks[trkIndex]
    randomTracks[trkIndex].choosed = true
    setSongUrl(trk.contentDetails.videoId)
    setSelectedTracks(randomTracks)
    setUsedTracks([...usedTracks, trk])
  }

  useEffect(() => {
    if (data) {
      handleTracks()
    }
  }, [round, data])

  if (isLoading) return <div>Fetching songs...</div>

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (error) return <div>Failed to fetch songs</div>

  const handleTimeout = (): void => {
    setScore(score - 5)
    setRound(round + 1)
    handleTracks()
  }

  const handlePlayerResponse = (track: Track) => {
    if (track.choosed) {
      setScore(score + 10)
    } else {
      setScore(score - 5)
    }

    setRound(round + 1)
    handleTracks()
  }

  return (
    <div className="game">
      <Timer key={round} start={startTime} maxTime={maxTime} onTimeout={handleTimeout} />
      <div className="score-text">{score} pt</div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '2rem'}}>
        {songUrl !== '' && <Player key={songUrl} id={songUrl} onPlay={() => setStartTime(true)} />}
      </div>
      <div className="track-list">
        {selectedTracks.map((track) => (
          <button key={track.id} className="track-button" onClick={() => handlePlayerResponse(track)}>
            {track.parsedTitlle}
          </button>
        ))}
        P</div>
    </div>
  )
}

export default Game
