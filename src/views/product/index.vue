<template>
	<div>
		<!-- 查询表单 -->
		<el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px" class="demo-form-inline">
			<!-- ！！！重点：重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
			<el-form-item prop="name">
				<el-input v-model="searchMap.name" placeholder="商品名称" style="width: 200px"></el-input>
			</el-form-item>
			<el-form-item prop="code">
				<el-input v-model="searchMap.code" placeholder="商品编码" style="width: 200px"></el-input>
			</el-form-item>
			<el-form-item prop="supplierName">
				<el-input readonly @click.native="dialogSupplierVisible=true" v-model="searchMap.supplierName" placeholder="供应商" style="width: 200px"></el-input>
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
			<el-table-column prop="name" label="商品名称"></el-table-column>
			<el-table-column prop="code" label="商品编码" width="90"></el-table-column>
			<el-table-column prop="spec" label="商品规格"></el-table-column>
			<el-table-column prop="retailPrice" label="零售价"></el-table-column>
			<el-table-column prop="pleasedPrice" label="进货价"></el-table-column>
			<el-table-column prop="storageNum" label="库存数量"></el-table-column>
			<el-table-column prop="supplierName" label="供应商"></el-table-column>
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
				<el-form-item label="商品名称" prop="name">
					<el-input v-model="pojo.name"></el-input>
				</el-form-item>
				<el-form-item label="商品编码" prop="code">
					<el-input v-model="pojo.code"></el-input>
				</el-form-item>
				<el-form-item label="商品规格" prop="code">
					<el-input v-model="pojo.spec"></el-input>
				</el-form-item>
				<el-form-item label="零售价" prop="retailPrice">
					<el-input v-model="pojo.retailPrice"></el-input>
				</el-form-item>
				<el-form-item label="进货价" prop="pleasedPrice">
					<el-input v-model="pojo.pleasedPrice"></el-input>
				</el-form-item>
				<el-form-item label="库存数量" prop="storageNum">
					<el-input v-model="pojo.storageNum"></el-input>
				</el-form-item>
				<el-form-item label="供应商" prop="supplierName">
					<el-input v-model="pojo.supplierName"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveData('addForm')">确 定</el-button>
			</div>
		</el-dialog>
		
		<!-- 选择供应商弹窗 -->
		<el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
			<!-- 父子组件传递参数，:dialog是自定义的参数 -->
			<supplier @option-supplier="optionSupplier" :dialog="true"></supplier>
		</el-dialog>
	</div>
</template>

<script>
	import Supplier from '@/views/supplier'
	import {
		search,
		add,
		get,
		update,
		remove
	} from '@/api/product'

	export default {
		// 注册Supplier为子组件
		components: {
			Supplier
		},
		data() {
			return {
				tableData: [],
				total: 0, //总记录数
				currentPage: 1, //当前页码
				pageSize: 20, //每页显示20条数据
				searchMap: { //条件查询绑定的条件值，一定要绑定值，否则重置后输入框无法输入
					name: '',
					code: '',
					supplierName: '',
					supplierId: ''
				},
				dialogTableVisible: false,
				dialogFormVisible: false,
				dialogSupplierVisible: false,  //选择供应商弹窗
				pojo: {
					name: '',
					code: '',
					spec: '',
					retailPrice: '',
					pleasedPrice: '',
					storageNum: '',
					supplierName: ''
				},
				addForm: {},
				rules: {
					name: [{
						required: true,
						message: '商品名称不能为空',
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
			optionSupplier(currentRow) {
				this.searchMap.supplierId = currentRow.id;
				this.searchMap.supplierName = currentRow.name;
				this.dialogSupplierVisible = false;
			}
		}
	}
</script>

<style>
</style>