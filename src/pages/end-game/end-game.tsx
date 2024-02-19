function EndGame (): JSX.Element {
  const players = [
    { name: 'Player01', score: 6578 },
    { name: 'Player02', score: 5423 },
    { name: 'Player03', score: 2141 },
    { name: 'Player04', score: 1564 }
  ]

  return (
    <div className="end-game-body" >
      <div className="scoreboard-container">
        <ul className="player-scores">
          {players.map((player, index) => (
            <li key={index} className="player-score-item">
              {player.name}
              <span className="score">{player.score} pt</span>
            </li>
          ))}
        </ul>
        </div>
      <button className="restart-game-btn">RESTART GAME</button>
      <button className="leave-game-btn">LEAVE GAME</button>
    </div>
  )
}

export default EndGame
