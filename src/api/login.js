import request from '@/utils/request'

export function login(username, password){
	return request({
		url: '/user/login',
		method: 'post',
		data:{
			username, //等价于username: username
			password
		}
	})
}

export function getUserInfo(token){
	return request({
		url: `/user/info/${token}`,
		method: 'get'
	})
}