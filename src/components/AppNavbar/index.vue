<template>
	<div class="navbar">
		<el-menu :router="true" :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
			<el-menu-item index="/home/">
				<i class="el-icon-menu"></i>
				<span slot="title">首页</span>
			</el-menu-item>
			<el-menu-item index="/member/">
				<i class="el-icon-menu"></i>
				<span slot="title">会员管理</span>
			</el-menu-item>
			<el-menu-item index="/supplier/">
				<i class="el-icon-menu"></i>
				<span slot="title">供应商管理</span>
			</el-menu-item>
			<el-menu-item index="/product/">
				<i class="el-icon-setting"></i>
				<span slot="title">商品管理</span>
			</el-menu-item>
			<el-menu-item index="/staff/">
				<i class="el-icon-setting"></i>
				<span slot="title">员工管理</span>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
	export default {
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		}
	}
</script>

<style>
	.el-menu{
		border-right: none;
	}
</style>