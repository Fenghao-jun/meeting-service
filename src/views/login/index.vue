<template>
  <div class="login-container">
    <div class="login-form">
      <span
        v-if="qywxLogin"
        class="backPwd"
        @click="qywxLogin = false"
      ><i class="el-icon-back" /> 账号密码登录</span>
      <div class="title-container">
        <h3 class="title">多媒体预约发布软件</h3>
      </div>
      <el-form
        v-if="!qywxLogin"
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        autocomplete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>

        <div class="pwdbtns">
          <el-checkbox v-model="isRemember">记住密码</el-checkbox>
          <div class="forgotPwd">忘记密码？</div>
        </div>

        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
        >登录
        </el-button>
        <div class="divider">第三方账户登录</div>
        <div class="qywx">
          <img src="@/assets/login/qywx.png" alt="" @click="handleWecomLogin">
        </div>
      </el-form>
      <!-- <div v-else id="ww_login" class="qywxbox">
        <h3>请使用企业微信扫码登录</h3>
        <img :src="qywxImg" alt="">
        <div class="agreement">
          扫码表示同意《<span>使用协议</span>》及《<span>隐私政策</span>》
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
// import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  // components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入正确的账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入正确的密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: false, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      isRemember: false, // 记住密码
      qywxLogin: false,
      qywxImg: '',
      wwLogin: {},
      corpid: 'ww2cde08ed6f3ab196',
      redirect_uri: 'http://api.hb-iot.com.cn/hb-iot-meeting/meeting/sso/wecom/login',
      agentid: '1000012'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    const username = localStorage.getItem('username')
    if (username) {
      this.loginForm.username = localStorage.getItem('username')
      this.loginForm.password = localStorage.getItem('password')
      this.isRemember = true
    }
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleWecomLogin() {
      // this.qywxLogin = true
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.corpid}&redirect_uri=${this.redirect_uri}&response_type=code&agentid=${this.agentid}&scope=snsapi_privateinfo&state=#wechat_redirect`
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              if (this.isRemember) {
                localStorage.setItem('username', this.loginForm.username)
                localStorage.setItem('password', this.loginForm.password)
              } else {
                localStorage.removeItem('username')
                localStorage.removeItem('password')
              }
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
// $cursor: #fff;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #ffffff00 inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  min-width: 520px;
  // background-color: $bg;
  --bg: url(~@/assets/login/login_bg.png);
  background: var(--bg) no-repeat;
  background-size: 100vw 100vh;
  overflow: hidden;
  position: relative;

  .backPwd {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 3;
    color: #fff;
    cursor: pointer;
  }

  .login-form {
    position: absolute;
    width: 520px;
    min-width: 520px;
    height: 600px;
    border: 1px solid #fff;
    border-radius: 8px;
    max-width: 100%;
    padding: 40px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    z-index: 666;

    .el-form,
    button {
      position: relative;
      z-index: 2;
    }

    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      filter: blur(5px);
      background: var(--bg) center;
      background-size: 100vw 100vh;
      z-index: 1;
    }

    ::v-deep .el-form-item {
      background: #fff;

      .el-form-item__content {
        line-height: 40px;

        input {
          color: #333;
          font-size: 18px;
        }

         input :-webkit-autofill {
          box-shadow: 0 0 0px 1000px #2834430d inset !important;
          -webkit-text-fill-color: #333 !important;
        }
      }
    }

    .pwdbtns {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #dcdcdc;
      padding-bottom: 20px;
      padding-left: 10px;
      font-size: 14px;

      .el-checkbox {
        color: #dcdcdc;
      }

      .forgotPwd {
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .divider {
      display: flex;
      align-items: center;
      position: relative;
      padding: 20px 10px;
      color: #fff;

      &::before {
        content: "";
        flex: 1;
        // border-bottom: 1px dotted #ccc;
        border-bottom: 1px solid #ccc;
        margin-right: 20px;
      }

      &::after {
        content: "";
        flex: 1;
        // border-bottom: 1px dotted #ccc;
        border-bottom: 1px solid #ccc;
        margin-left: 20px;
      }
    }

    .qywx {
      margin-top: 30px;

      img {
        margin: 0 auto;
        display: block;
        width: 63px;
        cursor: pointer;
      }
    }

    button {
      height: 50px;
      font-size: 18px;
    }
  }

  .qywxbox {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
    position: relative;

    h3 {
      color: #fff;
      font-size: 16px;
    }

    img {
      width: 180px;
      height: 180px;
      margin: 40px 0;
    }

    .agreement {
      color: #fff;
      font-size: 14px;

      span {
        color: #3c86ff;
        cursor: pointer;
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    z-index: 2;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
