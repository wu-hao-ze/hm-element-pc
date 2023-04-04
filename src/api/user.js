import request from '@/utils/request'

// export const login = (obj) => {
//   return request.post('/auth/login', {
//     username: obj.username,
//     password: obj.password
//   })
// }

// 登录api的封装
// 从传过来的对象中，解构出username和password
export const login = ({ username, password }) => {
  return request.post('/auth/login', {
    username,
    password
  })
}

// 获取当前的用户信息
export const getUser = () => {
  return request.get('/auth/currentUser')
}
