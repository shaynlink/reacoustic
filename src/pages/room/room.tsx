import { Link } from "react-router-dom"
import settings from './../../assets/settings.svg';
import home from './../../assets/Home.svg';
import link from './../../assets/Link.svg';
import user from './../../assets/UserS.svg';
import songs from './../../assets/Song.svg';
import { Tracksvalue, Timevalue, Choicevalue } from "../../atom";
import { useAtom } from 'jotai';

function Room (): JSX.Element {
  const players = ['Player01', 'Player02', 'Player03', 'Player04']
  const gameCode = 'KfP85D8GMjgs'
  const [tracksvalue, settracksValue] = useAtom(Tracksvalue);
  const [timesvalue, settimeValue] = useAtom(Timevalue);
  const [choicevalue, setchoiceValue] = useAtom(Choicevalue);
  return (
    <div className="lobby-container">
      <div className="line-room">
        <div className="stat-room">
          <span>{tracksvalue} <img src={songs} alt="Songs" width={"10%"}/> </span>
          <span>{timesvalue} s </span>
          <span>{choicevalue} choices</span>
        </div>
        <div className="settings">
        {/* <svg data-testid="SettingsIcon"></svg> */}
        <Link to="/settings">
        <img src={settings} alt="Settings"/>
        </Link>
        {/*<span>set</span>*/}
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
        {/*<span>home</span>*/} 
        </div>
        </Link>
      </div>
      <div className="line-room">
        <div className="link">
        <img src={link} alt=""/>
          {/*<span>link</span>*/}
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
