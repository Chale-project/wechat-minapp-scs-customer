import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/utils/api'
import util from '@/utils/util'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isNewUser: !0,
    token: wx.getStorageSync('token'),
    userInfo: {},
    storeId: null,
    storeInfo: {},
    openid: null,

    orderAddress: !1,
    orderAddressInfo: {
      distance: !0,
      info: {
        id: '',
        contact: '',
        mobile: '',
        spca: '',
        address: '',
      }
    }
  },
  mutations: {

    setIsNewUser(state, status) {
      state.isNewUser = status
    },

    setToken(state, token) {
      state.token = token
    },

    setUserInfo(state, userinfo) {
      state.userInfo = userinfo;
    },

    setStoreId(state, id) {
      state.storeId = id;
    },

    setStoreInfo(state, storeinfo) {
      state.storeInfo = storeinfo;
    },

    setWxOpenid(state, openid) {
      state.openid = openid;
    },

    setOrderAddress(state, flag) {
      state.orderAddress = flag
    },

    setOrderAddressInfo(state, info) {
      state.orderAddressInfo = info
    },
  },
  actions: {

    /**
     * 检测是否为系统用户
     */
    checkIsNewUser({ commit }, _this) {
      let code = null;
      return new Promise(function (resolve, reject) {
        return util.login().then((res) => {
          code = res.code
          return api.AuthLoginByWeixin({ code: code }).then((res) => {
            let data = res.result;
            commit('setIsNewUser', data.isNew)
            _this.isNewUser = data.isNew
            if (data.isNew) {
              commit('setWxOpenid', data.openid)
            } else {
              wx.setStorageSync('token', data.token.access_token)
              wx.setStorageSync('userInfo', data.userInfo)
              commit('setToken', data.token.access_token)
              commit('setUserInfo', data.userInfo)
              resolve()
            }
          })
        })
      })
    },

    /**
     * 解密微信登录
     */
    bindWxLogin({ commit }, _data) {
      return new Promise(function (resolve, reject) {
        return api.bindWxLogin(_data).then((res) => {
          let _token = res.result.token.access_token;
          let _userInfo = res.result.userInfo;

          wx.setStorageSync("token", _token);
          wx.setStorageSync("userInfo", _userInfo);

          commit("setToken", _token);
          commit("setUserInfo", _userInfo);

          commit('setIsNewUser', false)
          resolve()
        }).catch((err) => {
          reject(err);
        })
      })
    },

    /**
     * 调用微信登录小程序根据code换取用户信息
     */
    AuthLoginByWeixin({ commit }) {
      let code = null;
      return new Promise(function (resolve, reject) {
        return util.login().then((res) => {
          code = res.code
          return api.AuthLoginByWeixin({ code: code }).then((res) => {
            let data = res.result;
            commit('setIsNewUser', data.isNew)
            if (data.isNew) {
              commit('setWxOpenid', data.openid)
              wx.navigateTo({
                url: "/pages/auth/auth"
              });
            } else {
              wx.setStorageSync('token', data.token.access_token)
              wx.setStorageSync('userInfo', data.userInfo)
              commit('setToken', data.token.access_token)
              commit('setUserInfo', data.userInfo)

              commit('setIsNewUser', false)
              resolve()
            }
          }).catch((err) => {
            reject(err);
          })
        }).catch((err) => {
          reject(err);
        })
      })
    },


    /**
     * 设置OptionsQuery
     */
    setOptionsQuery({ commit }, sq) {
      return new Promise(function (resolve, reject) {
        if (sq.storeId) {
          const _storeId = sq.storeId;
          sq.that.storeId = _storeId;
          commit('setStoreId', _storeId)
        } else if (sq.options.scene) {
          const sceneObj = util.strToObj(sq.options.scene);
          sq.that.storeId = sceneObj.storeId;
          commit('setStoreId', sceneObj.storeId)
        } else if (sq.options.storeId) {
          const _storeId = sq.options.storeId;
          sq.that.storeId = _storeId;
          commit('setStoreId', _storeId)
        } else if (sq.options.q) {
          let _storeId = util.getQueryString(sq.options.q, "storeId");
          let _code = util.getQueryString(sq.options.q, "code");
          if (_storeId) {
            sq.that.storeId = _storeId;
            commit('setStoreId', _storeId)
          } else if (_code) {
            api.getStoreIdByCode(_code).then((res) => {
              const _codeStoreId = res.result;
              sq.that.storeId = _codeStoreId
              commit('setStoreId', _codeStoreId)
            })
          }

        }
        resolve()
      })

    },

    /**
     * 获取店铺信息
     */
    getStoreInfo({ commit }, options) {
      return new Promise(function (resolve, reject) {
        return api.getStoreInfo(options.storeId).then((res) => {
          options.that.storeInfo = res.info;
          commit('setStoreInfo', res.info)
          resolve(res.info)
        }).catch((err) => {
          reject(err);
        })
      })
    },

    /**
     * 添加店铺访问记录
     */
    setAccessRecort({ commit }, storeId) {
      return new Promise(function (resolve, reject) {
        return api.setAccessRecort({ shopId: storeId }).then((res) => {
          resolve()
        }).catch((err) => {
          reject();
        })
      })
    },

    /**
     * 获取提交订单收货地址
     */
    getOrderAddress({ commit }, options) {
      return new Promise(function (resolve, reject) {
        return api.getOrderAddressInfo(options).then((res) => {
          commit('setOrderAddressInfo', res.result)
          resolve(res.result)
        }).catch((err) => {
          reject(err);
        })
      })
    },

  }
})

export default store
