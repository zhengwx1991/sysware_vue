import Vue from "vue";
import Router from "vue-router";
// import Login from './views/login/index.vue'
//  下面情况，默认的会导入 ./views/login 目录下的index.vue组件
import Login from './views/login'
import Layout from '@/components/Layout.vue'
import Home from '@/views/home'
import Member from '@/views/member'
import Product from '@/views/product'
import Staff from '@/views/staff'
import Supplier from '@/views/supplier'

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/login',
			name: 'login', //路由名称
			component: Login //组件对象
		},
		{
			path: '/',
			name: 'layout', //路由名称
			component: Layout ,//组件对象
			redirect: '/home',
			children: [
				{
					path: '/home',
					component: Home,
					meta: {title: '首页'}
				}
			]
		},
		{
			path: '/member',
			component: Layout ,//组件对象
			children: [
				{
					path: '/',  //等价于  /member/
					component: Member,
					meta: {title: '会员管理'}
				}
			]
		},
		{
			path: '/product',
			component: Layout ,
			children: [
				{
					path: '/',
					component: Product,
					meta: {title: '商品管理'}
				}
			]
		},
		{
			path: '/staff',
			component: Layout ,
			children: [
				{
					path: '/',
					component: Staff,
					meta: {title: '员工管理'}
				}
			]
		},
		{
			path: '/supplier',
			component: Layout ,
			children: [
				{
					path: '/',
					component: Supplier,
					meta: {title: '供应商管理'}
				}
			]
		}
	]
});
