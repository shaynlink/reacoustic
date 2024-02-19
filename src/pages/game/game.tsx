interface Track {
  name: string
  artist: string
}

function Game (): JSX.Element {
  const score = 964
  const time = 900
  const tracks: Track[] = [
    { name: 'First track', artist: 'First artiste' },
    { name: 'Second track', artist: 'Second artiste' },
    { name: 'Third track', artist: 'Third artiste' },
    { name: 'Fourth track', artist: 'Fourth artiste' }
  ]

  return (
    <div className="game">
      <div className="time-bar">
        <div className="time-progress" style={{ width: `${time / 10}%` }}></div>
      </div>
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
