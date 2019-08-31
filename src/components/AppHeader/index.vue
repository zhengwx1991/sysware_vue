<template>
	<div class="header">
		<a href="#/">
			<img class="logo" src="../../assets/logo.png" width="20px" />
			<span class="company">软件集成研发平台</span>
		</a>
		<el-dropdown @command="handleCommand">
			<span class="el-dropdown-link">
				下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item icon="el-icon-plus" command="a">修改密码</el-dropdown-item>
				<el-dropdown-item icon="el-icon-circle-plus" command="b">退出</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</div>
</template>

<script>
	import {logout} from '@/api/login'
	export default{
		methods: {
			handleCommand(command) {
				switch (command){
					// 修改密码
					case 'a':
						this.$message(command)
						break;
					// 退出
					case 'b':
						const token = localStorage.getItem('sysware-token');
						logout(token).then(response => {
							const resp = response.data;
							if (resp.flag) {
								//清除本地浏览器信息
								localStorage.removeItem('sysware-token');
								localStorage.removeItem('sysware-user');
								this.$message('退出成功')
								this.$router.push('/login')
							} else {
								this.$message({
									message: resp.message,
									type: 'warning'
								})
							}
						})
						break;
					default:
						break;
				}
			}
		},
	}
</script>

<style>
	.logo {
		vertical-align: middle;
		padding: 0px 10px 0px 40px;
	}

	.company {
		position: absolute;
		color: white;
	}

	.el-dropdown {
		float: right;
		margin-right: 40px;
	}
	
	.el-dropdown-link{
		color: white;
		cursor: pointer;
	}
</style>
