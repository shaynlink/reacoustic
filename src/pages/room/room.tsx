function Room (): JSX.Element {
  const players = ['Player01', 'Player02', 'Player03', 'Player04']
  const gameCode = 'KfP85D8GMjgs'
  return (
    <div className="lobby-container">
      <div className="line-room">
        <div className="stat-room">
          <span>10 t </span>
          <span>10s </span>
          <span>2 choices</span>
        </div>
        <div className="settings">
        {/* <svg data-testid="SettingsIcon"></svg> */}
        <span>set</span>
        </div>
      </div>
      <ul className="player-list">
        {players.map((player, index) => (
          <li key={index} className="player-item">{player}</li>
        ))}
      </ul>
      <div className="line-room">
        <div className="current-player">
          <span>Player01...</span>
        </div>
        <div className= "home-button">
        <span>home</span>
        </div>
      </div>
      <div className="line-room">
        <div className="link">
          <span>link</span>
        </div>
        <div className="game-code">
          <span>{gameCode}</span>
        </div>
      </div>
        <button className="start-game-btn">START GAME</button>
    </div>
  )
}

export default Room
