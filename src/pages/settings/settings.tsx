import SliderComponentTrack from '../../components/Sliders/Trackslider'
import SliderComponentTime from '../../components/Sliders/Timeslider'
import SliderComponentChoices from '../../components/Sliders/Choiceslider'
import { Link } from 'react-router-dom'

export default function Settings (): JSX.Element {
  return (
    <div>
      <h1>Settings</h1>
      <div className="Settings">
        <SliderComponentTrack/>
        <SliderComponentTime/>
        <SliderComponentChoices/>
      </div>
      <Link to="/room">GO BACK</Link>
    </div>
  )
}
