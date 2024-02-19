import { Link } from 'react-router-dom'
import settings from './../../assets/settings.svg'
import home from './../../assets/Home.svg'
import link from './../../assets/Link.svg'
import user from './../../assets/UserS.svg'

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
        <img src={settings} alt="Settings"/>
        </div>
      </div>
      <ul className="player-list">
        {players.map((player, index) => (
          <li key={index} className="player-item">{player}</li>
        ))}
      </ul>
      <div className="line-room">
        <div className="current-player">
        <img src={user} alt="User"/>
          {<span>Player01...</span>}
        </div>
        <Link to="/">
        <div className= "home-button">
        <img src={home} alt="Home"/>
        </div>
        </Link>
      </div>
      <div className="line-room">
        <div className="link">
        <img src={link} alt=""/>
        </div>
        <div className="game-code">
          <span>{gameCode}</span>
        </div>
      </div>
      <Link to="/game">
        <button className="start-game-btn">START GAME</button>
      </Link>
    </div>
  )
}

export default Room
