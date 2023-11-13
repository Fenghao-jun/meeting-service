<template>
  <div>
    <el-input
      v-model="users"
      class="inputclick"
      placeholder="请选择外部参会人员"
      readonly
      :disabled="disabled"
      @click.native="openDialog"
    />
    <el-dialog
      title="添加外部参会人员"
      :visible.sync="visible"
      width="800"
      custom-class="outsidersDialog"
    >
      <ul v-loading="loading" class="outsiders-box">
        <el-form ref="form" :inline="true" :model="form" :rules="outsiderRule">
          <li v-for="(item, i) in form.outsidersList" :key="i">
            {{ `${i + 1}.` }}
            <el-form-item
              :prop="`outsidersList[${i}][name]`"
              :rules="outsiderRule.name"
            >
              <el-input v-model="item.name" size="mini" placeholder="姓名" />
            </el-form-item>
            <el-form-item
              :prop="`outsidersList[${i}][mail]`"
              :rules="outsiderRule.mail"
            >
              <el-input v-model="item.mail" size="mini" placeholder="邮箱" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="item.phone" size="mini" placeholder="电话" />
            </el-form-item>
            <img
              v-if="i === 0"
              src="@/assets/meeting/add.png"
              alt=""
              @click="add"
            >
            <img
              v-if="i > 0"
              src="@/assets/meeting/reduce.png"
              alt=""
              @click="reduce(i)"
            >
          </li>
        </el-form>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="loading"
          @click="submit"
        >确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const outsiders = () => {
  return {
    name: '',
    mail: '',
    phone: ''
  }
}
export default {
  name: 'Personnel',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      users: '',
      loading: false,
      form: {
        outsidersList: []
      },
      // outsidersList: [],
      outsiderRule: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  watch: {
    value: {
      handler(n, o) {
        if (n) {
          this.users = n.map((i) => i.name).join('、')
          this.form.outsidersList = JSON.parse(JSON.stringify(n))
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.form.outsidersList.length === 0) {
      this.form.outsidersList = this.form.outsidersList.concat(outsiders())
    }
  },
  methods: {
    openDialog() {
      if (this.disabled) return
      this.visible = true
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let flag = false
          this.form.outsidersList.forEach((item) => {
            for (const key in item) {
              if (!item[key]) {
                flag = true
              }
            }
          })
          if (flag) {
            this.$confirm('未填写完整的人员将不会被保存，是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.setVal()
              })
              .catch(() => {})
          } else {
            this.setVal()
          }
        } else {
          return false
        }
      })
    },

    // 赋值
    setVal() {
      this.users = this.form.outsidersList.map((i) => i.name).join('、')
      this.visible = false
      this.$emit('setVal', this.form.outsidersList)
    },

    // 新增
    add() {
      this.form.outsidersList = this.form.outsidersList.concat(outsiders())
    },
    // 删除
    reduce(i) {
      this.form.outsidersList.splice(i, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.inputclick {
  ::v-deep input {
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.outsidersDialog {
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  width: 700px;
  .el-dialog__header {
    .el-dialog__title {
      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      color: #000000;
      letter-spacing: 0.72px;
    }
  }
  .el-dialog__body {
    padding: 0 20px;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .outsiders-box {
      li {
        display: flex;
        align-items: center;
        .el-input {
          margin-left: 10px;
        }
        img {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
