<template>
	<div>
		<!-- 查询表单 -->
		<el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px" class="demo-form-inline">
			<!-- ！！！重点：重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
			<el-form-item prop="cardNumber">
				<el-input v-model="searchMap.cardNumber" placeholder="会员卡号" style="width: 200px"></el-input>
			</el-form-item>
			<el-form-item prop="name">
				<el-input v-model="searchMap.name" placeholder="会员名字" style="width: 200px"></el-input>
			</el-form-item>
			<el-form-item prop="payType">
				<el-select v-model="searchMap.payType" placeholder="支付类型" style="width: 110px">
					<!-- 不要忘记 payTypeOptions 绑定到data中,否则无法引用 -->
					<el-option v-for="option in payTypeOptions" :key="option.type" :label="option.name" :value="option.type"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="birthday">
				<!-- value-format 是指定绑定值的格式 -->
				<el-date-picker value-format="yyyy-MM-dd" type="date" v-model="searchMap.birthday" placeholder="会员生日" style="width: 200px"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="fetchData">查询</el-button>
				<el-button type="primary" @click="handleAdd">新增</el-button>
				<el-button @click="resetForm('searchForm')">重置</el-button>
			</el-form-item>
		</el-form>

		<!-- 表格 -->
		<el-table :data="tableData" border style="width: 100%">
			<!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
			<el-table-column type="index" label="序号" width="60"></el-table-column>
			<el-table-column prop="cardNumber" label="会员卡号"></el-table-column>
			<el-table-column prop="name" label="会员姓名" width="90"></el-table-column>
			<el-table-column prop="birthday" label="会员生日"></el-table-column>
			<el-table-column prop="phone" label="手机号码"></el-table-column>
			<el-table-column prop="integral" label="可用积分"></el-table-column>
			<el-table-column prop="money" label="开卡金额"></el-table-column>
			<el-table-column prop="payType" label="支付类型">
				<template slot-scope="scope">
					<span>{{scope.row.payType | payTypeFilter}}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="handleEdit(scope.row.id)" type="text" size="small">编辑</el-button>
					<el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页组件 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
		 :page-sizes="[20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>

		<!-- 新增表单 -->
		<el-dialog title="新增会员" :visible.sync="dialogFormVisible" width="500px">
			<el-form :rules="rules" ref="addForm" label-width="100px" label-position="right" style="width: 400px;" :model="pojo">
				<el-form-item label="卡号" prop="cardNumber">
					<el-input v-model="pojo.cardNumber"></el-input>
				</el-form-item>
				<el-form-item label="会员姓名" prop="name">
					<el-input v-model="pojo.name"></el-input>
				</el-form-item>
				<el-form-item label="会员生日" prop="birthday">
					<el-date-picker value-format="yyyy-MM-dd" type="date" v-model="pojo.birthday" placeholder="会员生日" style="width: 200px"></el-date-picker>
				</el-form-item>
				<el-form-item label="手机号码" prop="phone">
					<el-input v-model="pojo.phone"></el-input>
				</el-form-item>
				<el-form-item label="可用积分" prop="integral">
					<el-input v-model="pojo.integral"></el-input>
				</el-form-item>
				<el-form-item label="开卡金额" prop="money">
					<el-input v-model="pojo.money"></el-input>
				</el-form-item>
				<el-form-item label="支付类型" prop="payType">
					<el-select v-model="pojo.payType" placeholder="支付类型" style="width: 110px">
						<el-option v-for="option in payTypeOptions" :key="option.type" :label="option.name" :value="option.type"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="会员地址" prop="address">
					<el-input type="textarea" v-model="pojo.address"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveData('addForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		listMember,
		search,
		add,
		get,
		update,
		remove
	} from '@/api/member'

	const payTypeOptions = [{
			type: '1',
			name: '现金'
		},
		{
			type: '2',
			name: '微信'
		},
		{
			type: '3',
			name: '支付宝'
		},
		{
			type: '4',
			name: '银行卡'
		}
	]
	export default {
		data() {
			return {
				tableData: [],
				total: 0, //总记录数
				currentPage: 1, //当前页码
				pageSize: 20, //每页显示20条数据
				searchMap: { //条件查询绑定的条件值，一定要绑定值，否则重置后输入框无法输入
					cardNumber: '',
					name: '',
					payType: '',
					birthday: ''
				},
				payTypeOptions, //不要忘记 payTypeOptions 绑定到data中,否则无法引用
				dialogTableVisible: false,
				dialogFormVisible: false,
				pojo: {
					cardNumber: '',
					name: '',
					birthday: '',
					phone: '',
					integral: '',
					money: '',
					payType: '',
					address: ''
				},
				addForm: {},
				rules: {
					cardNumber: [{
						required: true,
						message: '卡号不能为空',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '姓名不能为空',
						trigger: 'blur'
					}],
					payType: [{
						required: true,
						message: '支付类型不能为空',
						trigger: 'change'
					}]
				}
			}
		},
		created() {
			this.fetchData()
		},
		methods: {
			fetchData() {
				//查询全部数据,注释掉
				//listMember().then(response => {
				// 分页查询
				search(this.currentPage, this.pageSize, this.searchMap).then(response => {
					const resp = response.data
					this.tableData = resp.data.rows
					this.total = resp.data.total
				})
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.fetchData()
			},
			handleCurrentChange(val) {
				this.currentPage = val
				this.fetchData()
			},
			// 表单重置
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 弹出新增窗口
			handleAdd() {
				this.dialogFormVisible = true;
				this.$nextTick(() => {
					// this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
					// 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
					this.$refs['addForm'].resetFields()
				})
			},
			saveData(formName) {
				// 表单验证
				this.$refs[formName].validate(valid => {
					if (valid) {
						// 通过有没有id判断是新增还是编辑操作
						if (this.pojo.id === null) {
							add(this.pojo).then(response => {
								const resp = response.data
								if (resp.flag) {
									this.$message({
										message: '新增成功',
										type: 'success'
									});
									this.dialogFormVisible = false;
									this.fetchData()
								} else {
									this.$message({
										message: resp.meaasge,
										type: 'warning'
									});
									this.$message.error('新增失败');
								}
							})
						} else {
							update(this.pojo).then(response => {
								const resp = response.data
								if (resp.flag) {
									this.$message({
										message: '编辑成功',
										type: 'success'
									});
									this.dialogFormVisible = false;
									this.fetchData()
								} else {
									this.$message({
										message: resp.meaasge,
										type: 'warning'
									});
									this.$message.error('编辑失败');
								}
							})
						}
					} else {
						return false;
					}
				})
			},
			handleEdit(id) {
				this.handleAdd()
				get(id).then(response => {
					const resp = response.data
					console.log(resp);
					if (resp.flag) {
						this.pojo = resp.data
					}
				})
			},
			handleDelete(id) {
				this.$confirm('确认删除这条记录吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					remove(id).then(response => {
						const resp = response.data
						if (resp.flag) {
							this.fetchData()
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						} else {
							this.$message({
								message: resp.meaasge,
								type: 'warning'
							});
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
		},
		filters: {
			payTypeFilter: function(type) {
				const payObj = payTypeOptions.find(obj => {
					return obj.type === type
				})
				return payObj ? payObj.name : null;
			}
		}
	}
</script>

<style>
</style>
