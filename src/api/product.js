import request from '@/utils/request'

// 分页搜索查询
export function search(page, size, searchMap) {
	return request({
		url: `/product/list/search/:page/:size`,
		method: 'post',
		data: searchMap
	})
}

// 新增
export function add(pojo) {
	return request({
		url: '/product',
		method: 'post',
		data: pojo
	})
}

// 根据ID查询
export function get(id) {
	return request({
		url: `/product/:id`,
		method: 'get',
	})
}

// 更新
export function update(pojo) {
	return request({
		url: `/product/:pojo.id`,
		method: 'put',
		data: pojo
	})
}

// 删除
export function remove(id) {
	return request({
		url: `/product/:id`,
		method: 'delete',
	})
}
