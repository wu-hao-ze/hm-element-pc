import { delToken, getToken, setToken } from '@/utils/storage'

export default {
  namespaced: true,
  state () {
    return {
      // 一进入页面，默认从本地读取token数据
      token: getToken() || ''
    }
  },
  mutations: {
    setUserToken (state, payload) {
      state.token = payload
      // 本地应该也存一份
      setToken(payload)
    },

    logout (state) {
      state.token = ''
      // 本地的也同步删除
      delToken()
    }
  },
  actions: {},
  getters: {}
}
