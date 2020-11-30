
### React + Webpack 中后端前端架构

- [x] [搭建环境](#id1) <br/>
- [x] [添加eslint代码规范](#id2) <br/>
- [x] [动态路由封装](#id3) <br/>
- [x] [Redux封装](#id4) <br/>
- [x] [引入ant组件](#id5) <br/>
- [x] [封装axios请求](#id6) <br/>
- [x] [添加全局loading](#id7) <br/>
- [x] [引入装饰器环境](#id8) <br/>
- [x] [添加mock数据](#id9) <br/>
- [x] [node实现接口转发](#id10) <br/>
- [x] [自动化部署项目发布上线](#id11) <br/> 
- [ ] [页面主框架布局搭建] <br/>
- [ ] [封装常用的公用组件] <br/>
- [ ] [支持typescript语法] <br/>
- [ ] [支持服务器端渲染] <br/>
- [ ] [引入微前端架构] <br/>
- [ ] [支持PWA离线应用开发] <br/>
- [ ] [支持前端监控] <br/>
- [ ] [支持Jest单元测试] <br/>

#### <div id="id1">一 搭建环境</div>

整个项目的目录架构如下：
```
|--- react-staging-template
| |--- build      
| | |--- webpack.base.conf.js 
| | |--- webpack.dev.conf.js
| | |--- webpack.dll.conf.js
| | |--- webpack.prod.conf.js
| |--- mock
| | |--- widget.json
| |--- node_modules
| |--- public
| | |--- index.html
| |--- src
| | |--- apiforward
| | | |--- apiList
| | | | |--- index.js
| | | | |--- widget.js
| | | |--- utils
| | | | |--- request.js
| | | | |--- userAgent.js
| | |--- components
| | | |--- NotFound.jsx 
| | |--- pages
| | | |--- home
| | | | |--- Home.jsx
| | | |--- about
| | | | |--- About.jsx
| | | |--- App.js
| | |--- routes
| | | |--- index.js
| | | |--- firstRouter.js
| | |--- server
| | | |--- config.js
| | | |--- domain.js
| | | |--- http.js
| | |--- store
| | | |--- modules
| | | |--- index.js
| | | |--- util.js
| | |--- assets
| | | |--- css 
| | | |--- images
| | |--- index.js
| |--- .babelrc
| |--- .eslintrc.js
| |--- .gitignore
| |--- babel.config.js
| |--- node.api.js
| |--- package.json
| |--- postcss.config.js
```

  如上是我脚手架的整个目录架构，下面分别介绍各个目录的含义：
```
build目录：主要是webpack进行项目打包，分了开发环境(webpack.dev.conf.js)和正式
环境(webpack.prod.conf.js)打包。

mock目录：可以对接口数据进行模拟。比如线上接口叫 'xxxxx/yyyy/widget' 这样的话，那么我们
只需要在mock文件夹下新建 widget.json文件即可。里面的数据就是和开发接口约定的数据复制进去即可。

public目录：就是一个index.html文件。

src目录：
  
  1、apiforward 目录：最主要存放 node实现接口转发的代码封装, 如果前面的mock数据满足不了的话，
  可以使用node进行接口数据转发，把线上的接口转发到本地node服务器上来，优点是：
    a. 可以解决跨域(不用配置cors)。
    b. 可以合并请求。
    c. 代码调试可以发ajax请求，实现接口测试。

  注意：node实现接口转发操作不是必须的。只是提供的一个可选方案。

  2、assets 目录：存放css文件和images图片等。

  3、components目录：就是可以存放React一些公用的组件。

  4、pages目录：存放对应的所有的模块页面。

  5、routes目录：保存所有的路由页面。

  6、server目录：对axios请求封装。

  7、store 目录：对Redux中的store，action等进行封装操作。

  8、node.api.js 主要使用node实现接口转发操作。
```

下面我来一步步讲解项目搭建的过程。

#### 一：搭建环境

  搭建脚手架环境框架是使用webpack进行搭建的，那么详细如何搭建的，可以看之前这篇文章，<a href="https://github.com/tugenhua0707/react-collection/blob/master/react/reactStaging.md">点击链接进去</a>

#### <div id="id2">二：添加eslint代码规范</div>

eslint代码规范也是在网上找到一个规范的，了解更详细的请看之前文章 <a href="https://github.com/tugenhua0707/react-collection/blob/master/es6/eslint.md">点击链接</a>, 我们也可以根据自己的项目中需要
的规范自己决定规范。

#### <div id="id3">三：动态路由封装</div>

  React v16.6.0以上版本才支持React.lazy(路由懒加载)和 Suspense，比如如下代码：
```
// 页面导出的时候
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
​
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
​
const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```
  如上是一般的路由懒加载方式，但是如果一个项目有100个页面的时候，多个模块的时候，我们把所有的路由写在一个页面中不好维护，并且100多个页面需要加载。因此我们需要封装路由及按需加载文件(使用懒加载)来编写：

  那我们怎么做呢？我们需要在项目中的src目录下新建routes文件夹，该文件夹保存所有路由文件。如下目录结构:
```
|--- routes
| |--- index.js
| |--- firstRouter.js
| |--- ......js 路由文件
```
  routes/firstRouter.js 是某一个路由模块文件，如果有多个模块的话，可以建议多个js文件来保存不同模块
的路由。该路由的文件的代码如下：
```
// 实现懒加载路由
import { lazy } from 'react';

const routers = [
  {
    path: '/',
    component: lazy(() => import('@pages/home/Home'))
  },
  {
    path: '/index',
    component: lazy(() => import('@pages/home/Home'))
  },
  {
    path: '/about',
    component: lazy(() => import('@pages/about/About')),
    // 可以传递参数
    meta: {
      id: 1
    }
  }
];
export default routers;
```
  然后在我们的index.js 引入该文件模块(如有多个都引入)，然后根据不同的路由条件懒加载不同的路由模块即可
。文件代码如下：
```
import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

// 导入所有的路由文件
import NotFound from '@components/NotFound';
import FirstRouter from './firstRouter';

const routes = [
  ...FirstRouter
];
// 根据条件生成相应的组件
const RouteWithSubRoutes = route => {
  if (!route.path) {
    return <Route component={NotFound} />;
  }
  return (
    <Route
      exact
      strict
      path = {route.path}
      render = {
        props => (
          route.redirect ? <Redirect push to={route.redirect} from={route.path} />
          : <route.component {...props} routes={route.routes} />
        )
      }
    />
  )
}

const RouterIndex = () => {
  return (
    <div>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          {
            routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)
          }
        </Suspense>
      </Router>
    </div>
  )
}

export default RouterIndex;
```
  然后我们需要在我们页面入口文件 src/pages/App.js 中引入该路由即可了。

  src/pages/App.js 代码如下：
```
import React, { Component } from 'react';
import RouterIndex from '@routes/index';
import '@assets/css/app.less';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <RouterIndex />
      </div>
    );
  }
}

export default App;
```
  src/index.js 代码如下：
```
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './pages/App';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```
#### <div id="id4">四：Redux封装</div>

#### 官方推荐action和reducer放在不同文件目录下，但是在编写代码中切换不同的文件很繁琐。
常见的做法，如demo列子，<a href="https://github.com/tugenhua0707/react-collection/blob/master/react/redux.md">点击链接</a>

  比如如上链接点击的demo的目录结构是如下：
```
|--- 项目
| |--- src
| | |--- reducer.js
| | |--- store.js
| | |--- action.js
| | |--- actionTypes.js
```
#### 1. src/actionTypes.js
```
export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
```
  actionTypes.js 是用来保存所有的操作类型的。

#### 2. src/reducer.js

  reducer是个纯函数，它接收参数并且更新数据。
  reducer会接收2个参数，previousState(老的状态数据)和action(在何种操作下)，返回newState(返回新的状态数据)。基本代码如下：
```
import * as ActionTypes from './actionTypes';
/** 
 * @param {Number} state 初始化数据为0，既可以是一个对象，也可以是一个数字
 * @param {Object} action 它是一个对象，一般包含 type(数据类型) 和 payload(需要被传递的数据)
 * @return {Number} newState 返回新的状态数据 
*/
export default (state = 0, action) => {
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return state + 1;
    case ActionTypes.DECREMENT:
      return state - 1;
    default:
      return state;
  }
}
```
#### 3.  src/action.js
```
import * as ActionTypes from './actionTypes';

export const increment = () => {
  return {
    type: ActionTypes.INCREMENT
  }
}

export const decrement = () => {
  return {
    type: ActionTypes.DECREMENT
  }
}
```
#### 4. src/store.js
```
import { createStore } from 'redux';
import Reducer from './reducer';

const store = createStore(Reducer);

export default store;
```
#### 5. 代码调用如下：
```
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import * as actionTypes from './actionTypes';
import * as actions from './action';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: store.getState()
    };
  }
  onIncrement = () => {
    // 触发disptah事件
    store.dispatch(actions.increment())
  }
  onDecrement = () => {
    // 触发dispatch事件
    store.dispatch(actions.decrement())
  }
  render() {
    store.subscribe(() => { 
      // 使用setState 重新渲染页面
      this.setState({
        count: store.getState()
      })
    });
    return (
      <div>
       <p>
         <button onClick={this.onIncrement}>increment</button>
       </p>
      <div>计数器的值：{this.state.count}</div>
       <p>
         <button onClick={this.onDecrement}>decrement</button>
       </p>
      </div>
      
    )
  }

}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```












