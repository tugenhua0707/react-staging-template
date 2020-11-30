
### React + Webpack 中后端前端架构

- [x] [搭建环境] <br/>
- [x] [添加eslint代码规范] <br/>
- [x] [动态路由封装] <br/>
- [x] [Redux封装] <br/>
- [x] [引入ant组件] <br/>
- [x] [添加全局loading] <br/>
- [x] [引入装饰器环境] <br/>
- [x] [封装axios请求] <br/>
- [x] [添加mock数据] <br/>
- [x] [node实现接口转发] <br/>
- [x] [自动化部署项目发布上线] <br/>
- [ ] [页面主框架布局搭建] <br/>
- [ ] [封装常用的公用组件] <br/>
- [ ] [支持typescript语法] <br/>
- [ ] [支持服务器端渲染] <br/>
- [ ] [引入微前端架构] <br/>
- [ ] [支持PWA离线应用开发] <br/>
- [ ] [支持前端监控] <br/>

#### 一 搭建环境

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
build目录：主要是webpack进行项目打包，分了开发环境(webpack.dev.conf.js)和正式环境(webpack.prod.conf.js)打包。

mock目录：可以对接口数据进行模拟。比如线上接口叫 'xxxxx/yyyy/widget' 这样的话，那么我们只需要在mock文件夹下
新建 widget.json文件即可。里面的数据就是和开发接口约定的数据复制进去即可。

public目录：就是一个index.html文件。

src目录：
  
  1、apiforward 目录：最主要存放 node实现接口转发的代码封装, 如果前面的mock数据满足不了的话，可以使用node
  进行接口数据转发，把线上的接口转发到本地node服务器上来，优点是：
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







