
import React, { Component} from 'react';
import { getWidget } from '@server/config';

export default class About extends Component {
  componentDidMount() {
    getWidget({
      'id': 'LocalNews',
      'ajax': 'json'
    }).then((data) => {
      console.log('data---', data);
    });
  }
  render() {
    return (
      <div>
        <h1>关于</h1>
      </div>
    );
  }
}

