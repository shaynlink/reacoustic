import React, { Component } from "react";
  
class Settings extends Component {
  constructor() {
    super();
    this.state = {
      name: "React"
    };
  }
  
  render() {
    return <div>This is how GFG child component 
                number 1 looks like.</div>;
  }
}
  
export default Settings;