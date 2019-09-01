<template>
	<div class="header">
		<a href="#/">
			<img class="logo" src="@/assets/logo.png" width="20px" />
			<span class="company">软件集成研发平台</span>
		</a>
		<el-dropdown @command="handleCommand">
			<span class="el-dropdown-link">
				{{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item icon="el-icon-plus" command="a">修改密码</el-dropdown-item>
				<el-dropdown-item icon="el-icon-circle-plus" command="b">退出</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>

		<!-- 修改密码 -->
		<el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
			<el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-width="100px" style="width: 300px;">
				<el-form-item label="原密码" prop="oldPass">
					<el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="pass">
					<el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import {
		logout
	} from '@/api/login'
	import {
		checkPassword,
		updatePassword
	} from '@/api/password'

	export default {
		data() {
			var validateOldPass = (rule, value, callback) => {
				checkPassword(this.user.id, value).then(response => {
					const resp = response.data
					if (resp.flag) {
						callback();
					} else {
						callback(new Error(resp.message));
					}
				})
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				user: JSON.parse(localStorage.getItem('sysware-user')),
				dialogFormVisible: false,
				ruleForm: {
					oldPass: '',
					pass: '',
					checkPass: ''
				},
				rules: {
					oldPass: [{
							required: true,
							message: '原密码不能为空',
							trigger: 'blur'
						},
						{
							validator: validateOldPass,
							trigger: 'blur'
						}
					],
					pass: [{
						required: true,
						message: '新密码不能为空',
						trigger: 'blur'
					}],
					checkPass: [{
							required: true,
							message: '确认密码不能为空',
							trigger: 'blur'
						},
						{
							validator: validatePass2,
							trigger: 'change'
						},
					]
				}
			}
		},
		methods: {
			handleCommand(command) {
				switch (command) {
					// 修改密码
					case 'a':
						this.handlePassword()
						break;
						// 退出
					case 'b':
						this.handleLogout()
						break;
					default:
						break;
				}
			},
			handleLogout() {
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
			},
			handlePassword() {
				this.dialogFormVisible = true;
				this.$nextTick(() => {
					this.$refs['ruleForm'].resetFields()
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			submitForm(formName) {
				// 表单验证
				this.$refs[formName].validate(valid => {
					if (valid) {
						updatePassword(this.user.id, this.ruleForm.checkPass).then(response => {
							const resp = response.data
							// 不管失败还是成功,都进行提醒
							this.$message({
								message: resp.message,
								type: resp.falg ? 'succcess' : 'warning'
							})
							if (resp.flag) {
								// 更新成功, 退出系统,回到登录页面
								this.handleLogout()
								// 关闭窗口
								this.dialogFormVisible = false
							}
						})
					} else {
						return false;
					}
				})
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

	.el-dropdown-link {
		color: white;
		cursor: pointer;
	}
</style>
