
import React, { Component } from 'react';
import RouterIndex from '@routes/index';
import '@assets/css/app.less';
import { Button } from 'antd';

class App extends Component {
  render() {
    return (
      <div>
        <Button>请点击按钮</Button>
        <RouterIndex />
      </div>
    );
  }
}

export default App;

