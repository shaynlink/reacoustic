import { useState, useEffect } from 'react'
import Timer from '../../components/Timer/Timer'
import Player from '../../components/Player/Player'
import axios from 'axios'
import useSWR from 'swr'
import { Tracksvalue, Choicevalue } from '../../atom'
import { useAtom } from 'jotai'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

interface Track {
  kind: string
  etag: string
  id: string
  contentDetails: {
    videoId: string
    videoPublishedAt: string
  }
  parsedTitlle: string
  choosed?: boolean
}

const fetcher = (url: string, playlist: string, trkvalue: number) => {
  return axios.get('https://reacoustic-2fqcvdzp6q-uc.a.run.app' + url, {
    params: {
      playlist
    }
  }).then((res) => {
    return res.data.filter((song: Track) => song.contentDetails.videoId !== '75g7GdgbkRU').sort(() => 0.5 - Math.random()).slice(0, trkvalue)
  })
}

function Game(): JSX.Element {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [tracksvalue] = useAtom(Tracksvalue)
  const [choicevalue] = useAtom(Choicevalue)
  const [startTime, setStartTime] = useState(false)
  const maxTime = 120
  const playlist = 'PL4fGSI1pDJn7bK3y1Hx-qpHBqfr6cesNs'
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([])
  const [songUrl, setSongUrl] = useState<string>('')
  const { data, error, isLoading } = useSWR<Track[]>('/getSongs', async (url: string) => await fetcher(url, playlist, tracksvalue))
  const { width, height } = useWindowSize()

  const handleTracks = () => {
    // Get 4 random tracks
    const randomTracks = data
      .sort(() => 0.5 - Math.random()).slice(0, choicevalue as number ?? 4)
    const trkIndex = Math.floor(Math.random() * 4)
    const trk = randomTracks[trkIndex]
    randomTracks[trkIndex].choosed = true
    setSongUrl(trk.contentDetails.videoId)
    setSelectedTracks(randomTracks)
  }

  useEffect(() => {
    if (data !== undefined && Array.isArray(data)) {
      handleTracks()
    }
  }, [round, data])

  if (isLoading) return <div style={{ color: 'black' }}>Fetching songs...</div>

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (error) return <div style={{ color: 'black' }}>Failed to fetch songs</div>

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

  if (round > tracksvalue) {
    return (
      <div>
        <Confetti
          width={width}
          height={height}
          numberOfPieces={200}
        />
        <h1>Game finish</h1>
        <h2 style={{ color: 'black' }}>Your score is {score}</h2>
      </div>
    )
  }

  return (
    <div className="game">
      <Timer key={round} start={startTime} maxTime={maxTime} onTimeout={handleTimeout} />
      <div className="score-text">{score} pt (round {round}/{tracksvalue})</div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '2rem' }}>
        {songUrl !== '' && <Player key={songUrl} id={songUrl} onPlay={() => { setStartTime(true) }} />}
      </div>
      <div className="track-list">
        {selectedTracks.map((track) => (
          <button key={track.id} className="track-button" onClick={() => { handlePlayerResponse(track) }}>
            {track.parsedTitlle}
          </button>
        ))}
        P</div>
    </div>
  )
}

export default Game
