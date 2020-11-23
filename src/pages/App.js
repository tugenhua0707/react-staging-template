import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom';

import store from '@store';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: store.getState().count
    };
  }
  onIncrement = () => {
    // 触发dispatch事件
    store.dispatch('counter/add');
  }
  minus = () => {
    // 触发dispatch事件
    store.dispatch('counter/minus');
  }
  render() {
    store.subscribe(() => {
      const { counter } = store.getState();
      // 使用setState 重新渲染页面
      this.setState({
        count: counter.count
      });
    });
    console.log(this.state);
    return (
      <div>
        <p onClick={this.onIncrement}>increment</p>
        <p onClick={this.minus}>minus</p>
        <p>计数器的值：{this.state.count}</p>

        <ul>
          <li><Link to='/index'>首页</Link></li>
          <li><Link to='/about'>关于</Link></li>
        </ul>
      </div>
    );
  }
}

export default App;

