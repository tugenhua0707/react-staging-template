
### React + Webpack 搭建前端脚手架

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
- [ ] [支持页面主框架布局] <br/>
- [ ] [封装常用的公用组件] <br/>
- [ ] [支持typescript语法] <br/>
- [ ] [支持服务器端渲染] <br/>
- [ ] [引入微前端架构] <br/>
- [ ] [支持PWA离线应用开发] <br/>
- [ ] [引入前端监控] <br/>
- [ ] [支持Jest单元测试] <br/>
- [ ] [引入Koa2+MongoDB+GraphQL实现全栈开发] <br/>

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
  routes/firstRouter.js 是某一个路由模块文件，如果有多个模块的话，可以使用多个js文件来保存不同模块的路由。该路由的文件的代码如下：
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
  然后在我们的index.js 引入该文件模块(如有多个都引入)，然后根据不同的路由条件懒加载不同的路由模块即可。文件代码如下：
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
常见的做法，如demo列子，<a href="https://github.com/tugenhua0707/react-collection/blob/master/react/redux.md">点击链接查看常见的做法</a>

  如上demo，我们把action和reducer放入到不同的文件里面，其实我们可以把他们放入一个文件里面的。比如我们现在放入 counter.js 文件内。
```
｜--- store
｜ ｜--- counter.js
```
  store/counter.js 代码如下：
```
const initialState = {
  count: 0
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        count: state.count + 1
      }
      break;
    
    default:
      return state;
      break;
  }
}
```
  但是如上代码，当reducer很多的时候，我们的switch情况就会非常多，因此我们可以将它转换成对象的风格，将case 中的action.type值转换成对象的属性名。
```
// 工具方法
const handleActions = ({ state, action, reducers}) =>
  Object.keys(reducers)
    .includes(action.type)
    ? reducers[action.type](state,action)
    : state

const initialState = {
  count: 0
};
const reducers = {
  add(state, action) {
    state.count++;
    console.log(state.count);
  },
  minus(state, action) {
    state.count--;
  }
};
export default (state = initialState, action) => handleActions({
  state,
  action,
  reducers,
});
```
  然后我们在页面上如下调用即可： store.dispatch({ type: 'add' });

  当页面点击触发一个action的时候，就会执行 handleActions 工具方法，遍历当前reducers对象是否包含 action.type的值，也就是 'add' 这个属性，如果包含的话，就执行 reducers.add(state, action); 该reducer函数。

  但是有时候当对象结构比较复杂的时候，嵌套对象很深的时候，我们可以通过引入 immer（一个小巧的不可变数据结构的库） 来优化。

  需要引入 immer 库来优化。
```
import produce from "immer"
```
  然后需要 修改 handleActions 工具函数。 最终目录结构变成如下：
```
export const handleActions = ({ state, action, reducers}) =>
  Object.keys(reducers)
    .includes(action.type)
    ? produce(state, draft => reducers[action.type](draft, action))
    : state

//新增了这一行
produce(state, draft => reducers[action.type](draft, action))
```
#### 增加命名空间

  当我们的项目大了后，我们写的 action 可能存在命名冲突的问题，解决办法是以当前文件名当做命名空间。

  比如我们现在项目中有很多reducer模块的话，我们可以用当前文件名当作命名空间。我们可以把我们store文件夹目录改成如下目录结构：
```
｜--- store
｜ ｜--- modules
｜ ｜ ｜--- counter.js
｜ ｜ ｜--- todoList.js
｜ ｜--- util.js
|  |--- index.js
```
  store/util.js 代码如下：
```
import produce from 'immer';

const getKey = (str, flag) => {
  const index = str.indexOf(flag);
  return str.substring(index + 1, str.length + 1);
};
export const handleActions = ({ state, action, reducers, namespace = '' }) => {
  const obj = Object.keys(reducers)
    .map(key => namespace + '/' + key)
    .includes(action.type)
    ? produce(state, draft => reducers[getKey(action.type, '/')](draft, action))
    : state;
  return obj;
};
```
  我们在页面中的调用方式需要改成： store.dispatch({ type: 'counter/add' }); 当我们触发action的时候，先调用 getKey方法，该方法接受2个参数，一个为：'counter/add', 另一个为 '/'; 然后使用 const index = 'counter/add'.indexOf('/'); 的位置。最后返回 return str.substring(index + 1, str.length + 1); 即：'add' 这个字符串。

  store/modules/counter.js 代码如下：
```
import { handleActions } from '../util';

const initialState = {
  count: 0
};
const reducers = {
  add(state, action) {
    state.count++;
    console.log(state.count);
  },
  minus(state, action) {
    state.count--;
  }
};
export default (state = initialState, action) => handleActions({
  state,
  action,
  reducers,
  namespace: 'counter'
});
```
  如上我们可以看到 counter.js 文件的命名空间为 counter。它的state的状态树就变成：
```
{
  counter: { 'count': 0 }
}
```
  如果在 store/module/todoList.js 下添加其他reducer模块的话，如下代码：
```
import { handleActions } from '../util';

const initialState = {
  inputValue: '123',
  list: []
};
const reducers = {
  add(state, action) {
    state.list.push(action.data);
  },
  delete(state, action) {
    state.list.splice(action.data, 1);
  },
  changeInput(state, action) {
    state.inputValue = action.data;
  }
};

export default (state = initialState, action) => handleActions({
  state,
  action,
  reducers,
  namespace: 'todo'
});
```
  那么现在的全局state状态树的数据结构变成如下了：
```
state = {
  counter: { 'count': 0 },
  todoList: {
    inputValue: '123',
    list: []
  }
};
```
  最后在我们的 store/index.js 添加如下代码：
```
import { createStore, combineReducers } from 'redux';
import counter from './modules/counter';
import todoList from './modules/todoList';
import { persistStore, persistReducer } from 'redux-persist';
//  存储机制，可换成其他机制，当前使用sessionStorage机制
import storageSession from 'redux-persist/lib/storage/session';
import { devToolsEnhancer } from 'redux-devtools-extension'; // redux调试工具

const reducers = combineReducers({
  counter,
  todoList,
});

const persistConfig = {
  key: 'root',
  storage: storageSession
  // navigation不会被存入缓存中，其他会，适用于少部分数据需要实时更新
  // blacklist: ['navigation']
  // navigation会存入缓存，其他不会存，适用于大多数数据并不会实时从后台拿数据
  // whitelist: ['navigation']
};
const myPersistReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  myPersistReducer,
  devToolsEnhancer(),
);

export const persistor = persistStore(store);
// const _dispatch = store.dispatch;
// store.dispatch = (type, data) => _dispatch({type, data});
export default store;
```























