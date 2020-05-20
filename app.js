const TOKEN = 'token'

App({
  globalData: {
    token: ''
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // 先从缓存中取出token
    const token = wx.getStorageSync(TOKEN)
    // 判断token是否有值
    if(token && token.length !== 0) {
      // 已经有token值，验证token是否过期
      this.check_token(token);
    }else {
      // 没有token，进行登录
      this.login();
    }
  },
  // 验证token是否过期
  check_token(token) {
    wx.request({
      url: 'http://123.207.32.32:3000/auth',
      method: 'post',
      header: {
        token
      },
      success: (res) => {
        if(!res.data.errCode) {
          this.globalData.token = token;
        }else {
          this.login();
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
   // 登录操作
  login() {
        wx.login({
          // code只有5分钟的有效期
          complete: (res) => {
            // 获取code
            const code = res.code;
            // 将code发送给我们的服务器
            wx.request({
              url: 'http://123.207.32.32:3000/login',
              method: 'post',
              data: {
                code
              },
              success: (res) => {
                // 取出token
                const token = res.data.token;
                // 将token保存在globalData中
                this.globalData.token = token;
                // 进行本地存储
                wx.setStorageSync(TOKEN, token)
              }
            })
          },
        })
  }
})
