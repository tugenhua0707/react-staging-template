
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import '@assets/css/app.less';
import Home from '@pages/home/Home';
import About from '@pages/about/About';

class App extends Component {
  render() {
    return (
      <div>
        <div>111</div>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/index' exact component={Home} />
          <Route path='/about' exact component={About} />
        </Switch>
      </div>
    );
  }
}

export default App;

