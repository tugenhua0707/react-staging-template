
### React + Webpack 搭建中后台前端脚手架

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
- [x] [引入qiankun微前端架构](#id12) <br/>
- [ ] [支持页面主框架布局] <br/>
- [ ] [封装常用的公用组件] <br/>
- [ ] [支持typescript语法] <br/>
- [ ] [支持服务器端渲染] <br/>
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

### 一：搭建环境

  搭建脚手架环境框架是使用webpack进行搭建的，那么详细如何搭建的，可以看之前这篇文章，<a href="https://github.com/tugenhua0707/react-collection/blob/master/react/reactStaging.md">点击链接进去</a>

### <div id="id2">二：添加eslint代码规范</div>

eslint代码规范也是在网上找到一个规范的，了解更详细的请看之前文章 <a href="https://github.com/tugenhua0707/react-collection/blob/master/es6/eslint.md">点击链接</a>, 我们也可以根据自己的项目中需要
的规范自己决定规范。

### <div id="id3">三：动态路由封装</div>

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
### <div id="id4">四：Redux封装</div>

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

  需要引入 immer 库来优化。<a href="https://segmentfault.com/a/1190000017270785">查看immer使用</a>
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
### <div id="id5">五：引入ant组件</div>

  1. 引入antd组件需要按需加载。首先安装插件，如下命令：
```
npm install --save-dev babel-plugin-import　
```
  2. 在项目的根目录下 babel.config.js 引入如下配置项：
```
module.exports = {
  plugins: [
  	[
  	  "import", {
  	  	"libraryName": "antd",
  	  	"libraryDirectory": "es",
  	  	"style": "css"
  	  }
  	]
  ]
}
```
  3. 最后按需引入antd中的组件，无需再单独引入样式文件，App.js：
```
import React from "react";
// import Button from "antd/es/button";
// import "antd/dist/antd.css";
import { Button } from "antd";
 
function App() {
  return (
    <div className="App">
      app
      <Button type="primary">btn</Button>
    </div>
  );
}
export default App;
```
### <div id="id6">六：封装axios请求</div>

  封装axios请求是根据之前文章来进行封装的，之前的文章，请看<a href="https://github.com/tugenhua0707/react-collection/blob/master/ajax/axios.md">这篇文章</a>, 因此把它封装的思想引入到项目中来，因此在我们项目中，我这边在src文件夹目录下新建了一个server文件夹目录，该目录有如下结构文件。
```
├── src
│ ├── server 
│ │ ├── config.js
│ │ ├── domain.js
│ │ └── http.js
└──
```
  http.js 是对 axios 请求进行封装的，如下封装代码：
```
// src/server/http.js
import axios from 'axios';
import QS from 'qs'; // 引入qs模块, 用来序列化post类型的数据
import store from '@store';

class HttpClient {
  constructor(cfg) {
    this.timeout = 10000; // 10秒超时
    this.withCredentials = true;
    // 异常的回掉函数, 对外面全局处理
    if (cfg && cfg.responseException) {
      this.responseException = cfg.responseException;
    }
  }
  setInterceptors(instance, options) {
    // 获取请求拦截器
    instance.interceptors.request.use((config) => {
      const method = config.method;
      // 如果是post或put
      if (method && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) {
        config.data = QS.stringify(config.params);
        delete config.params;
      }
      /* 设置请求头部 比如登录token，登录时候可以获取保存到store中， 然后这边可以动态获取到该token值。*/
      config.headers['Accept'] = 'application/x-www-form-urlencoded';
      config.headers.common['Authorization'] = 'AUTH_TOKEN';

      // 外部方法处理请求拦截器后 再返回config
      options.requestCallBack && options.requestCallBack(config);
      return config;
    }, err => Promise.reject(err));

    // 处理响应拦截器
    instance.interceptors.response.use((response) => {

      // 外部方法处理响应拦截器后 再返回response
      options.responseCallBack && options.responseCallBack(response);
      if (response.status === 200) {  // 正常200的情况下
        return response.data;
      } else {
        // 处理响应拦截器异常的情况
        this.responseException && this.responseException(response);
      }
    }, (err) => {
      // 处理响应拦截器异常的情况
      this.responseException && this.responseException(err);
      console.log('err.response', err);
      return Promise.reject(err);
    })
  }
  request(options) {
    // 每次请求都会创建新的axios的实列
    const instance = axios.create();
    // 参数合并
    const config = {
      timeout: this.timeout,
      withCredentials: this.withCredentials,
      ...options,
    };
    // 设置拦截器
    this.setInterceptors(instance, config);
    return instance(config); // 返回axios的实列的执行结果
  }
}

export default HttpClient;
```
  src/server/config.js 是保存项目中所有请求的，比如代码如下：
```
// src/server/http.js

/**
 * api 接口统一管理
*/
// 域名引入
import { namespace } from './domain';
import HttpClient from './http';

const loc = window.location;
let prefix = '';
const dev = 'mode=dev';
const apiforward = ['localhost', '127.0.0.1'];
let domain = namespace;

if (loc.href.indexOf(dev) > -1) {
  // prefix = '';
} else {
  const flag = apiforward.filter((v) => loc.href.indexOf(v) > -1);
  if (flag) {
    prefix = '/api';
    domain = '';
  }
}
console.log('-----prefix----', prefix);

// 统一处理异常信息
const exception = {
  responseException(err) {
    console.log('返回异常', err);
    let message = '';
    const status = err.status - 0;
    switch (status) {
      case 400:
        message = '请求错误(400)';
        break;
      case 401:
        message = '未授权，请重新登录(401)';
        break;
      case 403:
        message = '拒绝访问(403)';
        break;
      case 404:
        message = '请求出错(404)';
        break;
      case 408:
        message = '请求超时(408)';
        break;
      case 500:
        message = '服务器错误(500)';
        break;
      case 501:
        message = '服务未实现(501)';
        break;
      case 502:
        message = '网络错误(502)';
        break;
      case 503:
        message = '服务不可用(503)';
        break;
      case 504:
        message = '网络超时(504)';
        break;
      case 505:
        message = 'HTTP版本不受支持(505)';
        break;
      default:
        message = `连接出错(${status})!`;
    }
    return `${message}，请检查网络或联系管理员！`;
  }
};
const httpClient = new HttpClient(exception);
const params = function(options) {
  const obj = {};
  for (const i in options) {
    obj[i] = options[i];
  }
  return obj;
};

// ---------------  公用的上传和下载 ---------------
export const fileUpload = options => httpClient.request({
  url: '',
  params: params(options),
  method: 'post',
  headers: { 'Content-Type': 'multipart/form-data' }
});

// 文件下载
export const download = options => httpClient.request({
  url: '',
  params: params(options),
  method: options.method || 'post',
  responseType: options.blob || 'arraybuffer'
});


// 接口请求示列
export const getWidget = options => httpClient.request({
  url: `${domain}` + prefix + '/widget',
  params: params(options),
  method: 'get',
  // 请求拦截器回调函数
  requestCallBack(cfg) {
    console.log('xxxx--请求拦截器添加参数----');
    console.log(cfg);
    cfg.headers['Accept'] = 'application/x-www-form-urlencoded';
    cfg.headers.common['Authorization'] = 'AUTH_TOKEN';
  },
  // 响应拦截器回调函数
  responseCallBack(cfg) {
    // cfg.status = 404;
    console.log('---响应拦截器可以对返回的数据进行构造---', cfg);
    // cfg.data = {'xx': 11};
  }
});
```
  src/server/domian.js 是处理接口不同域名的，基本代码可以如下：
```
export const namespace = 'http://localhost:8081';
export const namespace2 = 'http://127.0.0.1:3002';
```
### <div id="id7">七：添加全局loading</div>

  在项目开发中往往需要在接口返回较慢的时候给出loading的状态，防止在接口返回值的过程中用户多次点击，因此我们这里使用了antd组件需要包裹想要遮罩的元素，那么我们如何在请求的入口统一添加全局的loading呢？

#### 使用redux实现全局loading

#### 添加Spin

  首先我们需要在入口文件 src/pages/App.js 中添加全局的Spin，Spin组件包裹所有的元素，代码如下：

  src/pages/App.js 代码如下：
```
import React, { Component } from 'react';
import RouterIndex from '@routes/index';
import '@assets/css/app.less';
import { Button, Spin } from 'antd';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  render() {
    const { loading } = this.state;
    console.log('loading加载状态', loading);
    return (
      <Spin spinning={loading} wrapperClassName="page-loading">
        <div>
          <Button>请点击按钮</Button>
          <RouterIndex />
        </div>
      </Spin>
    );
  }
}
export default App;
```
#### 接口拦截设置Loading显示

  我们需要在接口发出请求之前设置Loading显示，在返回之后设置为其隐藏。

  因此我们需要定义两个action动作，一个用来打开loading，另一个是用来关闭loading。因此我们需要新建一个loading.js。因此我在 src/store/modules/ 中新建
loading.js 来使用redux来实现全局的loading。之前有redux的思想，我们同样可以使用到loading上了。

  src/store/modules/loading.js 基本代码如下：
```
import { handleActions } from '../util';

const initialState = {
  loading: false
};
const reducers = {
  open(state, action) {
    state.loading = true;
  },
  closed(state, action) {
    state.loading = false;
  }
};
export default (state = initialState, action) => handleActions({
  state,
  action,
  reducers,
  namespace: 'loading'
});
```
  代码完成以后，我们需要在 src/index.js 入口文件引入该loading.js , 代码如下：
```
// src/index.js

import { createStore, combineReducers } from 'redux';
import counter from './modules/counter';
import todoList from './modules/todoList';
import loading from './modules/loading';  // 新增的 引入loading
import { persistStore, persistReducer } from 'redux-persist';
//  存储机制，可换成其他机制，当前使用sessionStorage机制
import storageSession from 'redux-persist/lib/storage/session';
import { devToolsEnhancer } from 'redux-devtools-extension'; // redux调试工具

const reducers = combineReducers({
  counter,
  todoList,
  loading,
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
  最后我们需要在 src/server/http.js 请求之前设置loading，请求之后关闭loading，部分代码如下添加：
```
// src/server/http.js
import axios from 'axios';
import QS from 'qs'; // 引入qs模块, 用来序列化post类型的数据
import store from '@store';

class HttpClient {
  constructor(cfg) {
    
  }
  setInterceptors(instance, options) {
    // 获取请求拦截器
    instance.interceptors.request.use((config) => {
      // 全局loading
      store.dispatch({ type: 'loading/open' });
    }, err => Promise.reject(err));

    // 处理响应拦截器
    instance.interceptors.response.use((response) => {
      // 关闭全局loading
      store.dispatch({ type: 'loading/closed' });
      // ... 其他更多代码
    }, (err) => {
      // 关闭全局loading
      store.dispatch({ type: 'loading/closed' });
      // ... 其他更多代码
    })
  }
  request(options) {
    // 每次请求都会创建新的axios的实列
    const instance = axios.create();
    // 参数合并
    const config = {
      timeout: this.timeout,
      withCredentials: this.withCredentials,
      ...options,
    };
    // 设置拦截器
    this.setInterceptors(instance, config);
    return instance(config); // 返回axios的实列的执行结果
  }
}

export default HttpClient;
```
  在接口发出请求之前通过 store.dispatch({ type: 'loading/open' }); 派发操作，在接口返回时候（不管接口请求成功还是失败）都通过 store.dispatch({ type: 'loading/closed' }); 来关闭loading。

#### loading优化

  如果一个页面只有一个接口请求的话，那么上述方法是可行的，但是如果一个页面有多个接口，当其中有个接口返回值很慢的时候我们就会发现问题，就是当一个接口还是pending时候，全局loading就消失了。当然这不是我们想要的结果。按道理应该是当页面所有的接口同时请求都pending结束后才隐藏loading的。因此我们需要添加一个计数器。基本代码如下：
```
// src/server/http.js
import axios from 'axios';
import QS from 'qs'; // 引入qs模块, 用来序列化post类型的数据
import store from '@store';

/* 添加一个计数器 */
let needLoadingRequestCount = 0
/**
 * 显示loading
 */
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    store.dispatch({ type: 'loading/open' });
  }
  needLoadingRequestCount++
}
/**
 * 隐藏loading
 */
function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) {
    return;
  }
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    store.dispatch({ type: 'loading/closed' });
  }
}

class HttpClient {
  constructor(cfg) {
    
  }
  setInterceptors(instance, options) {
    // 获取请求拦截器
    instance.interceptors.request.use((config) => {
      // 全局loading
      // store.dispatch({ type: 'loading/open' });
      showFullScreenLoading();
    }, err => Promise.reject(err));

    // 处理响应拦截器
    instance.interceptors.response.use((response) => {
      // 关闭全局loading
      tryHideFullScreenLoading();
      // store.dispatch({ type: 'loading/closed' });
      // ... 其他更多代码
    }, (err) => {
      // 关闭全局loading
      tryHideFullScreenLoading();
      // store.dispatch({ type: 'loading/closed' });
      // ... 其他更多代码
    })
  }
  request(options) {
    // 每次请求都会创建新的axios的实列
    const instance = axios.create();
    // 参数合并
    const config = {
      timeout: this.timeout,
      withCredentials: this.withCredentials,
      ...options,
    };
    // 设置拦截器
    this.setInterceptors(instance, config);
    return instance(config); // 返回axios的实列的执行结果
  }
}

export default HttpClient;
```
### <div id="id8">八：引入装饰器环境</div>

  需要安装babel插件，如果 babel >= 7.x 的时候，
```
npm install --save-dev @babel/plugin-proposal-decorators
```
  如果 babel@6.x 的时候
```
npm install --save-dev babel-plugin-transfrom-decorators-legacy
```
  然后需要在项目的根目录的 babel.config.js 添加如下配置代码：

  babel >= 7.x
```
module.exports = {
  presets: [
  	"@babel/preset-env",
  	"@babel/preset-react"
  ],
  plugins: [
  	"@babel/plugin-transform-arrow-functions", // 箭头函数的处理
  	// "@babel/plugin-proposal-class-properties",
    ["@babel/plugin-proposal-decorators", {"legacy": true}], // 这个是装饰器
    ["@babel/plugin-proposal-class-properties", { "loose": false }],
  	[
  	  "import", {
  	  	"libraryName": "antd",
  	  	"libraryDirectory": "es",
  	  	"style": "css"
  	  }
  	]
  ]
}
```
  babel@6.x 
```
module.exports = {
  presets: [],
  plugins: [
  	"transform-decorators-legacy"
  ]
}
```
  装饰器如何使用，也可以看之前的文章 <a href="https://github.com/tugenhua0707/react-collection/blob/master/es6/decorator.md">Es6/Es7之Decorator装饰器模式</a>

### <div id="id9">九：添加mock数据</div>

#### 安装 json-mocker-tool
```
npm install --save-dev json-mocker-tool
```
  然后在项目的根目录 build/webpack.dev.conf.js中会引入该插件
```
.... // 更多代码

// 引入mock工具
const mocker = require('json-mocker-tool');

module.exports = {
  devServer: {
    before: app => {
      mocker({
        mockDir: path.resolve('./mock')
      })(app);
    }
  }
};
```
  在项目中使用mock数据来模拟真实接口也是非常简单的，正常如何编写ajax请求，还是按照之前一样写即可，如果ajax请求为：'http://xxx/yyy/widget.json' 的话，
我们只需要在项目根目录下的mock文件夹中 新建 widget.json文件，然后把和后端约定好的数据格式复制进去即可。然后如果想使用的话，直接在地址栏中添加参数:
mode=dev 刷新页面即可生效会走本地的mock数据。

  想了解更多，mock如何实现的，<a href="https://github.com/tugenhua0707/react-collection/blob/master/mock/mock.md">请看这篇文章</a> 

### <div id="id10">十：node实现接口转发</div>

  node转发API的优势：
```
1. 可以在中间层把java返回的数据处理成对前端更友好的方式。
2. 可以解决前端跨域问题，因为服务器端的请求是不涉及跨域的，跨域是浏览器的同源策略导致的。
3. 可以将多个请求通过中间层合并，减少前端的请求。
```
  1. 首选我们需要安装 express
```
npm install --save express
```
  2. 然后在我们项目的根目录下 新建 node.api.js 文件，基本代码如下：
```
/**
 * 职责:
 * 1. 创建服务
 * 2. 模板引擎
 * 3. body-parser 解析表单post请求体
 * 4. 提供静态资源服务
 * 5. 挂载路由
 * 6. 监听端口启动服务
*/

const express = require('express');
const Router = express.Router();

// 引入api路由
const apiList = require('./src/apiforward/apiList/index');
const app = express();
const port = process.env.PORT || 3002;

// 设置静态资源
app.use('/node_modules/', express.static('./node_modules/'));
app.use('/public/', express.static('./public/'));

app.use((req, res, next) => {
  // 解决跨域
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// 挂载路由
app.use(apiList(Router));

app.listen(port, () => {
  console.log(`app listening on http://127.0.0.1:${port}`);
});
```
  3. 在 src/apiforward 新建如下文件。
```
｜--- src
｜ |--- apiforward
｜ | |--- apiList
｜ | | |--- index.js
｜ | | |--- widget.js
｜ | |--- utils
｜ | | |--- request.js
｜ | | |--- userAgent.js
```
  3.1. 在src/utils文件夹中创建 request.js文件，用来处理axios。代码如下：
```
// src/utils/request.js
const axios = require('axios');
const userAgent = require('./userAgent');

const request = (paramInfo) => {
  function getDataFn(obj) {
  	const getData = {
  	  url: obj.url,
  	  method: obj.method || 'get',
  	  baseURL: obj.baseURL || 'http://news.baidu.com/',
  	  headers: {
  	  	'User-Agent': userAgent(),
  	  }
  	};
  	if (getData.method === 'get') {
  	  getData.params = obj.data;
  	} else {
  	  getData.data = obj.data;
  	}
  	return getData;
  }
  if (!Array.isArray(paramInfo)) {
  	return axios(getDataFn(paramInfo));
  } else {
  	const fetchArray = paramInfo.map(v => {
  	  return axios(getDataFn(v));
  	});
  	return new Promise((resolve, reject) => {
  	  axios.all(fetchArray)
  	  	.then(axios.spread(function(...arg){
  	  	  // 多个请求都执行完成
  	  	  resolve(arg);
  	  	})).catch(err => {
  	  	  console.log('请求异常:' +err);
  	  	})
  	});
  }
};

module.exports = request;
```
  3.2. 创建随机User-Agent
 
  在src/utils文件夹中创建 userAgent.js 文件
```
// 返回一个随机的请求头 headers的UA
const user_agent_list = [
  // 各种PC端
  // Safari
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2",
  // chrome
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11",
  "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.133 Safari/534.16",
  // 360
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
  // QQ浏览器
  "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)",
  "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)",
  // sogou浏览器
  "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.84 Safari/535.11 SE 2.X MetaSr 1.0",
  "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SV1; QQDownload 732; .NET4.0C; .NET4.0E; SE 2.X MetaSr 1.0)",
   
   // 各种移动端
   // IPhone
   "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
   // IPod
   "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
   // IPAD
   "Mozilla/5.0 (iPad; U; CPU OS 4_2_1 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5",
   "Mozilla/5.0 (iPad; U; CPU OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
   // Android
   "Mozilla/5.0 (Linux; U; Android 2.2.1; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
   "Mozilla/5.0 (Linux; U; Android 2.3.7; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
   // QQ浏览器 Android版本
   "MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
   // Android Opera Mobile
   "Opera/9.80 (Android 2.3.4; Linux; Opera Mobi/build-1107180945; U; en-GB) Presto/2.8.149 Version/11.10",
   // Android Pad Moto Xoom
   "Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13",
   // BlackBerry
   "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.337 Mobile Safari/534.1+",
   // WebOS HP Touchpad
   "Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/233.70 Safari/534.6 TouchPad/1.0",
   // Nokia N97
   "Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 NokiaN97-1/20.0.019; Profile/MIDP-2.1 Configuration/CLDC-1.1) AppleWebKit/525 (KHTML, like Gecko) BrowserNG/7.1.18124",
   // Windows Phone Mango
   "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; HTC; Titan)",
   // UC浏览器
   "UCWEB7.0.2.37/28/999",
   "NOKIA5700/ UCWEB7.0.2.37/28/999",
   // UCOpenwave
   "Openwave/ UCWEB7.0.2.37/28/999",
   // UC Opera
   "Mozilla/4.0 (compatible; MSIE 6.0; ) Opera/UCWEB7.0.2.37/28/999",
   // 一部分 PC端的
   "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.1 Safari/536.3",
   "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1061.0 Safari/536.3",
   "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.24 (KHTML, like Gecko) Chrome/19.0.1055.1 Safari/535.24",
   "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/535.24 (KHTML, like Gecko) Chrome/19.0.1055.1 Safari/535.24"
]

module.exports = () =>{
  const index = Math.floor(Math.random() * user_agent_list.length);
  return user_agent_list[index];
}
```
  3.3. apiList的封装

  在src/apifoward 文件目录下 新建  widget.js 文件，添加如下代码：
```
module.exports = (app) => {
  app.get('/widget', async(req, res) => {
  	try {
  	  const result = await app.request({
  	  	url: 'widget?id=LocalNews&ajax=json',
        method: 'get',
  	  	data: {
  	  	  ...req.query
  	  	}
  	  });
  	  res.send(result.data);
  	} catch (err) {
  	  res.send({
  	  	code: 500,
  	  	msg: err.message
  	  })
  	}
  })
}
```
  3.4. 需要在当前文件夹中再创建入口文件 src/apiList/index.js
```
const fs = require('fs');
const path = require('path');

const request = require('../utils/request');

// 查找出当前文件夹所有的api文件名 不包括 index.js
const routes = fs.readdirSync(__dirname).filter(item => item.indexOf('index') !== 0);

module.exports = (router) => {
  // 将请求放到每个实列中
  router.request = request;
  routes.forEach((item) => {
  	const routeFn = require(path.resolve(__dirname, item));
  	routeFn(router);
  });
  return router;
};
```
  3.5. 最后：更新我们完整的入口index.js文件, 请看第二步，已经引入了  const apiList = require('./src/apiforward/apiList/index');

  这些所有做完以后，我们还是需要 在 build/webpack.dev.conf.js 中配置下，
```
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3002',
        changeOrigin: true,  // 是否跨域
        pathRewrite: {
          '^/api' : ''  // 重写路径
        }
      }
    },
  }
}
```
  需要在每个请求之前添加 /api 前缀目录，先转发到node启动的服务下 http://127.0.0.1:3002，再node会转发真正的接口数据，然后使用本地的node域名就可以拿到
数据，以后如果有多个接口的话，都可以在 src/apifoward/apiList目录下新建对应的接口文件即可（和widget.js文件类似的写法即可）。

  因此我们需要在 src/server/config.js 中进行简单前缀配置下，如下代码：
```
const loc = window.location;
let prefix = '';
const dev = 'mode=dev';
const apiforward = ['localhost', '127.0.0.1'];
let domain = namespace;

if (loc.href.indexOf(dev) > -1) {
  // prefix = '';
} else {
  const flag = apiforward.filter((v) => loc.href.indexOf(v) > -1);
  if (flag) {
    prefix = '/api';
    domain = '';
  }
}
console.log('-----prefix----', prefix);
```
  然后在 src/server/config.js 代码中编写接口如下：
```
export const getWidget = options => httpClient.request({
  url: `${domain}` + prefix + '/widget',
  params: params(options),
  method: 'get',
});
```
  就可以了，其他的也是一样，前缀我在该文件中已经进行处理了，如果 location.href 后面有 mode=dev的话，说明是本地进行mock数据，如果不是这个的话，就会使用node进行转发操作。当然如果你不想进行转发的话，也可以自己改下。看自己的需要吧，最主要为了防止在有的情况下接口跨域（开发没有配置cors的情况下）。

4. 在package.json添加启动命令：
```
scripts: {
  "api": "nodemon node.api.js"
}
```
  最后我们重启node服务即可。使用命令：npm run api ，同时启动本地服务 npm run dev 即可看到效果。

### <div id="id11">十一：自动化部署项目发布上线</div>
```
1. npm i my-auto-deploy-cli -g 把包下载下来。
2. 进入自己的项目的根目录，然后运行 deploy init 命令下载配置文件.
3. 在我们的项目的根目录下会生成 deploy/deploy.config.js 文件.
```
  deploy/deploy.config.js 配置文件内容如下：
```
const config = {
  privateKey: '', // 本地私钥地址，比如 xxx/.ssh/id_rsa  非必填，有私钥 就配置
  passphrase: '', // 本地私钥密码, 非必填，有私钥 就配置
  projectName: 'kongzhi自动化',
  dev: {
    name: '测试环境',
    script: 'npm run build', // 打包
    host: '', // 测试服务器地址
    post: 22, // ssh port 一般默认22
    username: 'root', // 登录服务器用户名
    password: '', // 登录服务器密码
    targetDir: '../dist',  // 目标压缩目录（可使用相对地址）
    targetFile: 'dist.zip', // 目标文件
    openBackUp: true, // 是否开启远端备份
    deployDir: '/usr/local/nginx/html' + '/', // 远端目录
    releaseDir: 'web' // 发布目录
  },
  prod: {
    name: '线上环境',
    script: 'npm run build', // 打包
    host: '', // 服务器地址
    post: 22, // ssh port 一般默认22
    username: 'root', // 登录服务器用户名
    password: '', // 登录服务器密码
    targetDir: '../dist',  // 目标压缩目录（可使用相对地址）
    targetFile: 'dist.zip', // 目标文件
    openBackUp: true, // 是否开启远端备份
    deployDir: '/usr/local/nginx/html' + '/', // 远端目录
    releaseDir: 'web' // 发布目录
  }
};
module.exports = config;
```
  4. 配置下我们的配置文件，这里提供了2种环境，一个是开发环境 dev，另一个是prod环境指的是打包到线上。我们把 host， username， password等等配置填写成自己的。配置完成后，比如我们打包代码到开发环境请，我们只需要运行 deploy dev 命令即可

  想了解更多，<a href="https://github.com/tugenhua0707/fe-deploy-cli-template/tree/master/my-auto-deploy-cli">请看这篇文章</a> 

  Node实现自动化部署，<a href="https://github.com/tugenhua0707/react-collection/blob/master/autoDeployment/autoDeploy1.md">请看这篇文章</a>

### <div id="id12">十二：引入qiankun微前端架构</div>

  qiankun有那些优点，懒得说，可以看官网 <a href="https://qiankun.umijs.org/zh/api">进入qiankun官网API</a>

  React引入微前端可以查看demo，<a href="https://github.com/tugenhua0707/micro-app-react">点击查看</a>

  下面是分享如何使用 qiankun 如何搭建主应用基座，然后接入react技术栈来完成微应用。

#### 构建主应用基座

  将一般的项目改造成 qiankun 主应用基座，需要完成如下三个步骤：
```
1. 创建微应用容器 --- 目的是用于承载微应用，渲染显示微应用。
2. 注册微应用 --- 设置微应用的激活条件，微应用地址等等。
3. 启动qiankun。
```
#### 1. 创建微应用容器

  我们先下载react脚手架，我这边先使用本react搭建框架做demo，我们可以在本地指定的目录克隆react模版，如下命令：
```
git clone https://github.com/tugenhua0707/react-staging-template.git
```
  然后修改 项目的文件名称为：'micro-app-main', 该项目是主应用框架，接着我继续克隆一份，项目的文件名改成 'micro-app-react', 这是react其中一个的微应用。

  我们先在主应用中(micro-app-main)创建微应用的承载容器，该容器规定了微应用的显示区域，微应用将在该容器内渲染并显示。

  我们先设置路由，一般路由代码如下：
```
// micro-app-main/src/routes/firstRouter.js 代码如下：

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
    key: 'ReactMicroApp',
    title: 'React主页',
    path: '/react'
  }
];
export default routers;
```
  然后我们启动服务，访问 http://localhost:8082/ 后就可以看到 home组件页面了。/react 路由是我们后续要添加的微应用。这里先不管。

#### 2. 注册微应用

  主框架搭建好了以后，我们需要使用 qiankun 的 registerMicroApps 方法注册微应用。

  首先我们需要在我们项目中 micro-app-main/src 新建micro文件夹，用于保存微应用文件。有如下文件：
```
｜--- micro
｜ |--- app.js
｜ |--- index.js
```
```
// micro-app-main/src/micro/app.js 代码如下：
/**
 * name: 微应用名称 -- 只有唯一性
 * entry: 微应用入口 --- 通过该地址加载微应用
 * container: 微应用挂载节点 --- 微应用加载完成后将挂载在该节点上
 * activeRule: 微应用触发的路由规则 --- 触发路由规则后将加载该微应用
 */
const apps = [
  {
    name: 'ReactMicroApp',
    entry: '//localhost:8083',
    container: '#root',
    activeRule: '/react',
    // 可以直接传参
    props: {
      pro: '传参'
    }
  }
];

export default apps;

// micro-app-main/src/micro/index.js 代码如下：

import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start,
} from 'qiankun';

// 注册微应用
import app from './app';

/**
 * 注册微应用
 * 第一个参数 --- 微应用的注册信息
 * 第二个参数 --- 全局生命周期钩子函数
 */
registerMicroApps(app, {
  // qiankun --- 微应用加载前
  beforeLoad(app) {
    console.log('before load', app.name);
    return Promise.resolve();
  },
  // qiankun --- 微应用挂载后
  afterMount(app) {
    console.log('after mount', app.name);
    return Promise.resolve();
  }
});

/**
 * 添加全局的未捕获的异常处理
 */
addGlobalUncaughtErrorHandler((event) => {
  console.log(event);
  const { message } = event;
  if (message) {
    console.log('微应用加载失败, 请检查应用是否可运行');
  }
});

// 导出 qiankun 的启动函数
export default start;
```
#### 3. 启动主应用

  如上代码，我们已经注册好了微应用，导出start函数后，我们需要在合适的地方调用start启动主应用。代码如下：
```
// micro-app-main/src/index.js

import startQiankun from './micro';
startQiankun();
```
  如上就是我们的主应用基座的配置了。

#### 接入微应用

  我们现在主应用基座已经搭建好了，现在我们需要接入微应用了。我们需要在 刚刚创建的 micro-app-react 框架中进行配置。

#### 1. 配置微应用

  在主应用注册好了微应用后，我们还需要对微应用进行一系列配置，首先我们需要在react的入口文件 index.js中，导出 qiankun主应用所需要的三个生命周期钩子函数，代码实现如下：
```
// micro-app-react/src/public-path.js

if (window.__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

// micro-app-react/src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import { persistor } from '@store';
import store from '@store';
import App from './pages/App';
import './public-path';

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */

 function render() {
   ReactDOM.render(
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>,
    document.getElementById('subRoot'));
 }

 // 独立运行时，直接挂载应用
 if (!window.__POWERED_BY_QIANKUN__) {
   render();
 }

 /**
  * bootstrap 只会在微应用初始化时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap.
  * 一般情况下我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
  */
 export async function bootstrap() {
   console.log('ReactMicroApp bootstraped');
 }

 /**
  * 应用每次进入都会调用 mount 方法，一般情况下我们在这里触发应用的渲染方法
  */
 export async function mount(props) {
  console.log('ReactMicroApp mount', props);
  render(props);
 }

 /**
  * 应用每次 卸载会调用该方法，一般我们会卸载微应用的应用实列
  * @return null
  */
 export async function unmount() {
  console.log('ReactMicroApp unmount');
  ReactDOM.unmountComponentAtNode(document.getElementById('subRoot'));
 }
```
   配置好了入口文件index.js后，我们还需要配置路由命名空间，来确保主应用可以正确加载微应用。代码如下：
```
 // micro-app-react/src/routes/index.js

....  更多代码

 const BASE_NAME = window.__POWERED_BY_QIANKUN__ ? '/react' : '';
 const RouterIndex = () => (
    <div>
      <Router basename={BASE_NAME}>
        <Suspense fallback={<div>Loading...</div>}>
          {
            routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)
          }
        </Suspense>
      </Router>
    </div>
  );
....  更多代码
```
#### 配置webpack
```
// micro-app-react/build/webpack.base.conf.js

const obj = {
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../dist'),
    // 微应用的包名，这里要与主应用中注册的微应用名称一致
    library: `ReactMicroApp`,
    // 将你的 library 暴露为所有的模块定义下都可运行的方式
    libraryTarget: 'umd',
    // 按需加载相关，设置为 webpackJsonp_ReactMicroApp 即可
    jsonpFunction: `webpackJsonp_ReactMicroApp`
  },
}
```
#### 解决跨域

  解决跨域需要在 micro-app-react/build/webpack.dev.conf.js 下配置下：
```
// micro-app-react/build/webpack.dev.conf.js
.... 更多代码
const baseWebpackConfig = require('./webpack.base.conf');
module.exports = merge(baseWebpackConfig, {
  devServer: {
    // 允许被主应用跨域
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
.... 更多代码
```
如下图所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/106.jpg" /> <br />


















