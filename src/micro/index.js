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
