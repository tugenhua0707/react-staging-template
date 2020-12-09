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
  },
];
export default routers;

