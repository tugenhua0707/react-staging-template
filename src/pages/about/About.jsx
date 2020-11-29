
import React, { Component} from 'react';
import { getWidget } from '@server/config';

function log(target, name, descriptor) {
  target.islog = true;
  /*
   打印：
   ƒ Car() {
     babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Car);
   }
  */
  console.log(target); // Car类本身
  console.log(name); // undefined
}

// @log
export default class About extends Component {
  xx = () => {
  	console.log(this)
  	return 'aa';
  }

  componentDidMount() {
    getWidget({
      'id': 'LocalNews',
      'ajax': 'json'
    }).then((data) => {
      console.log('data---');
      console.log(data);
    }).catch(err => {
      console.log(err);
    });
  }
  render() {
  	console.log('------测试-----');
  	console.log(this);
    return (
      <div>
        <h1>关于</h1>
      </div>
    );
  }
}

