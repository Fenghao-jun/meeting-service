<template>
  <div :class="classObj" class="app-wrapper">
    <div class="app-header">
      <logo />
      <div class="right-menu">
        <!-- <template>
          <search id="header-search" class="right-menu-item" />
          <error-log class="errLog-container right-menu-item hover-effect" />
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
          <el-tooltip content="Global Size" effect="dark" placement="bottom">
            <size-select
              id="size-select"
              class="right-menu-item hover-effect"
            />
          </el-tooltip>
        </template> -->

        <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <img src="@/assets/user.png" class="user-avatar">
            <!-- <i class="el-icon-caret-bottom" /> -->
            <span>{{ username }}</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided @click.native="passwordFun">
              <span style="display: block">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
    <el-dialog width="500px" title="修改密码" :visible.sync="showPassword" @close="cancelFun">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="原密码" label-width="80px" prop="oldPwd">
          <el-input v-model="form.oldPwd" show-password maxlength="20" placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" label-width="80px" prop="newPwd">
          <el-input v-model="form.newPwd" show-password maxlength="20" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" label-width="80px" prop="newTwoPwd">
          <el-input v-model="form.newTwoPwd" show-password maxlength="20" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">取 消</el-button>
        <el-button type="primary" @click="saveFun">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import Logo from './components/Sidebar/Logo'
import { updatePassword } from '@/api/user'
// import Search from '@/components/HeaderSearch'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
const formData = () => {
  return {
    newPwd: '',
    oldPwd: '',
    newTwoPwd: ''
  }
}

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    Logo
    // Search,
    // ErrorLog,
    // Screenfull,
    // SizeSelect
  },
  mixins: [ResizeMixin],
  data() {
    return {
      showPassword: false,
      form: formData(),
      rules: {
        oldPwd: [{ required: true, trigger: 'change', message: '请输入原密码' }, { required: true, validator: this.validLNum, tirgger: 'blur' }],
        newPwd: [{ required: true, trigger: 'change', message: '请输入新密码' }, { required: true, validator: this.validLNum, tirgger: 'blur' }],
        newTwoPwd: [{ required: true, trigger: 'change', message: '请二次确认密码' }, { required: true, validator: this.validNum, tirgger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      username: (state) => state.user.name,
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    saveFun() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          updatePassword({ newPwd: this.form.newPwd, oldPwd: this.form.oldPwd }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              setTimeout(() => {
                this.logout()
              }, 1000)
            }
          })
        }
      })
    },
    validLNum(rule, value, callback) {
      setTimeout(() => {
        if (value.length < 6 || value.length > 20) {
          callback(new Error('请输入6-20位密码'))
        } else {
          callback()
        }
      }, 50)
    },
    validNum(rule, value, callback) {
      setTimeout(() => {
        if (this.form.newPwd !== this.form.newTwoPwd) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      }, 50)
    },
    passwordFun() {
      this.showPassword = true
    },
    cancelFun() {
      this.form = formData()
      this.$refs['ruleForm'].resetFields()
      this.showPassword = false
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .app-header {
    height: 60px;
    background: #0a6cdbe5;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    .right-menu {
      float: right;
      height: 100%;
      line-height: 60px;
      // display: flex;
      // align-items: center;
      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }

      .avatar-container {
        margin-right: 20px;

        .avatar-wrapper {
          // margin-top: 5px;
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          color: #fff;
          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            margin-right: 10px;
            // border-radius: 10px;
          }

          .el-icon-caret-bottom {
            color: #fff;
            cursor: pointer;
            position: absolute;
            right: -20px;
            bottom: 10px;
            font-size: 12px;
          }
        }
      }
      .errLog-container {
        display: inline-block;
        vertical-align: top;
      }
    }
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: calc(100% - 60px);
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
