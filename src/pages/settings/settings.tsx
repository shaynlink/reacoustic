import React, { Component } from "react";
import SliderComponentTrack from "../../components/Sliders/Trackslider";
import SliderComponentTime from "../../components/Sliders/Timeslider";
import SliderComponentChoices from "../../components/Sliders/Choiceslider";
import { Link } from "react-router-dom";

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      name: "React"
    };
  }
  
  render() {
    return<div><h1>Settings</h1><div className="Settings">
        <SliderComponentTrack/>
        <SliderComponentTime/>
        <SliderComponentChoices/>
      </div>
      <Link to="/room">GO BACK</Link>
      </div>;
  }
}
  
export default Settings;