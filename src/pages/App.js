
import React, { Component } from 'react';
import RouterIndex from '@routes/index';
import '@assets/css/app.less';
import loadable from '@src/utils/Loadable';


class App extends Component {
  render() {
    return (
      <div>
        <RouterIndex />
      </div>
    );
  }
}

export default App;

