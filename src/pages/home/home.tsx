import { Link } from "react-router-dom"

function Home (): JSX.Element {
  return (
    <>
      <h1>{'REACOUSTIC'}</h1><br /><br />
      <div className="center">
        <Link to="/room"><button className="button">{'SOLO'}</button><br /><br /></Link>
        <Link to="/room"><button className="button">{'MULTIPLAYER'}</button><br /><br /></Link>
        <Link to="/room"><button className="buttonInput">{'JOIN ROOOM'}<br /><input className="input" placeholder={'enter code ...'}></input></button></Link>
      </div>
    </>
  )
}

export default Home
