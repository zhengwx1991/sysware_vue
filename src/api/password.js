import request from '@/utils/request'

// 校验密码是否正确,userId用户名，password旧密码
export function checkPassword(userId, password) {
	return request({
		url: '/user/password',
		method: 'post',
		data: {
			userId,
			password
		}
	})
}

// 更新密码,userId用户名，password新密码
export function updatePassword(userId, password) {
	return request({
		url: '/user/password',
		method: 'put',
		data: {
			userId,
			password
		}
	})
}