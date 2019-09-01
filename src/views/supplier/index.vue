<template>
	<div>
		<!-- 查询表单 -->
		<el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px" class="demo-form-inline">
			<!-- ！！！重点：重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
			<el-form-item prop="name">
				<el-input v-model="searchMap.name" placeholder="供应商名称" style="width: 200px"></el-input>
			</el-form-item>
			<el-form-item prop="linkman" v-if="!dialog">
				<el-input v-model="searchMap.linkman" placeholder="联系人" style="width: 200px"></el-input>
			</el-form-item>
			<el-form-item prop="phone" v-if="!dialog">
				<el-input v-model="searchMap.phone" placeholder="联系电话" style="width: 200px"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="fetchData">查询</el-button>
				<el-button type="primary" @click="handleAdd" v-if="!dialog">新增</el-button>
				<el-button @click="resetForm('searchForm')" v-if="!dialog">重置</el-button>
			</el-form-item>
		</el-form>

		<!-- 表格 -->
		<!-- highlight-current-row 激活单选行
            @current-change 当点击某一行后,会触发这个事件,从而调用对应的函数clickCurrentChange
            clickCurrentChange函数会接收两个参数:currentRow，oldCurrentRow
         -->
		<el-table :highlight-current-row="dialog" @current-change="clickCurrentChange" :data="tableData" border style="width: 100%">
			<!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
			<el-table-column type="index" label="序号" width="60"></el-table-column>
			<el-table-column prop="name" label="供应商名称"></el-table-column>
			<el-table-column prop="linkman" label="联系人" width="90" v-if="!dialog"></el-table-column>
			<el-table-column prop="phone" label="联系电话" v-if="!dialog"></el-table-column>
			<el-table-column prop="remark" label="备注" v-if="!dialog"></el-table-column>
			<el-table-column fixed="right" label="操作" width="100" v-if="!dialog">
				<template slot-scope="scope">
					<el-button @click="handleEdit(scope.row.id)" type="text" size="small">编辑</el-button>
					<el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页组件 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
		 :page-sizes="[20, 50, 100]" :page-size="pageSize" :layout="!dialog ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
		 :total="total">
		</el-pagination>

		<!-- 新增表单 -->
		<el-dialog v-if="!dialog" title="新增会员" :visible.sync="dialogFormVisible" width="500px">
			<el-form :rules="rules" ref="addForm" label-width="100px" label-position="right" style="width: 400px;" :model="pojo">
				<el-form-item label="供应商名称" prop="name">
					<el-input v-model="pojo.name"></el-input>
				</el-form-item>
				<el-form-item label="联系人" prop="linkman">
					<el-input v-model="pojo.linkman"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="phone">
					<el-input v-model="pojo.phone"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="pojo.remark"></el-input>
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
		search,
		add,
		get,
		update,
		remove
	} from '@/api/supplier'

	export default {
		props: {
			// 接收父组件传递过来的信息，通过是否为dialog判断是不是弹窗
			dialog: Boolean
		},
		data() {
			return {
				tableData: [],
				total: 0, //总记录数
				currentPage: 1, //当前页码
				pageSize: 20, //每页显示20条数据
				searchMap: { //条件查询绑定的条件值，一定要绑定值，否则重置后输入框无法输入
					name: '',
					linkman: '',
					phone: ''
				},
				dialogTableVisible: false,
				dialogFormVisible: false,
				pojo: {
					name: '',
					linkman: '',
					phone: '',
					remark: ''
				},
				addForm: {},
				rules: {
					name: [{
						required: true,
						message: '供应商名称不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			this.fetchData()
		},
		methods: {
			fetchData() {
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
			// 当点击某一行时调用
			clickCurrentChange(currentRow) {
				console.log(currentRow)
				// 点击后,要将点击的数据传递到父组件(商品管理中), 
				// 则可以通过触发父组件中的option-supplier, 触发之后 ,
				// 父组件可以在 option-supplier 这个事件对应的处理函数中进行接收数据currentRow
				this.$emit('option-supplier', currentRow)
			}
		}
	}
</script>

<style>
</style>
