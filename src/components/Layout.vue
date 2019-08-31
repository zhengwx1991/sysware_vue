<template>
	<div>
		<app-header></app-header>
		<app-navbar></app-navbar>
		<app-main></app-main>
	</div>
</template>

<script>
	import AppHeader from './AppHeader'
	import AppNavbar from './AppNavbar'
	import AppMain from './AppMain'
	
	export default{
		components: {
			AppHeader,
			AppNavbar,
			AppMain
		}
	}
</script>

<style>
	.header {
		position: absolute;
		line-height: 50px;
		top: 0px;
		right: 0px;
		left: 0px;
		background-color: #B3C0D1;
	}
	
	.navbar {
		position: absolute;
		top: 50px;
		width: 200px;
		left: 0px;
		bottom: 0px;
		overflow-y: auto;
		background-color: #D3DCE6;
	}
	
	.main {
		position: absolute;
		top: 50px;
		right: 0px;
		bottom: 0px;
		left: 200px;
		padding: 5px;
		overflow-y: auto;
		background-color: #E9EEF3;
	}
</style>