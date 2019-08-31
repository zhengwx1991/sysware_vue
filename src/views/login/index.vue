<template>
	<div class="login-container">
		<el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
			<h2 class="login-title">软件集成研发平台</h2>
			<el-form-item label="账号" prop="username">
				<el-input v-model="form.username"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="form.password" type="password"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('form')">登陆</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	/* 按需引入js方法 */
	import {login, getUserInfo} from '@/api/login'
	export default {
		data() {
			return {
				form: {},
				rules: {
					username: [{
						required: true,
						message: '账号不能为空',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// 提交表单给后台进行验证是否正确
						login(this.form.username, this.form.password).then(response => {
							const resp = response.data
							console.log(resp, resp.flag, resp.data.token)
							if (resp.flag) {
								// 验证成功，通过token获取用户信息
								getUserInfo(resp.data.token).then(response => {
									const respUser = response.data
									if (respUser.flag) {
										//取到用户信息
										console.log('userInfo', respUser.data)
										// 1、保存token,用户信息
										localStorage.setItem('sysware-user', JSON.stringify(respUser.data))
										localStorage.setItem('sysware-token', resp.data.token)
										// 前往首页
										this.$router.push('/')
									} else{
										this.$message({
											message: respUser.message,
											type: 'warning'
										})
									}
								})
							} else {
								// 未验证通过
								this.$message({
									message: resp.message,
									type: 'warning'
								})
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style>
	.login-container {
		position: absolute;
		width: 100%;
		height: 100%;
		background: url(../../assets/login.jpg);
	}

	.login-form {
		width: 350px;
		margin: 160px auto;
		background-color: rgb(255, 255, 255, 0.8);
		padding: 28px;
		border-radius: 20px;
	}

	.login-title {
		color: #303133;
		text-align: center;
	}
</style>
