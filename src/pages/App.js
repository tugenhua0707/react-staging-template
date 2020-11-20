import React, { Component } from "react";
import {
  Link
} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to='/index'>首页</Link></li>
          <li><Link to='/about'>关于</Link></li>
        </ul>
      </div>
    );
  }
}

export default App;

