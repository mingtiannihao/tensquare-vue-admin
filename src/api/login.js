import request from '@/utils/request'

export function login(loginname, password) {
  return request({
    url: '/user/admin/login',
    method: 'post',
    data: {
      loginname,
      password
    }
  })
}

export function getInfo(loginname) {
  console.log(loginname)
  return request({
    url: '/user/admin/info',
    method: 'get',
    params: { loginname }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
