<template>
  <div>
    <el-input
      v-model="users"
      class="inputclick"
      placeholder="请选择内部参会人员"
      readonly
      :disabled="disabled"
      @click.native="openDialog"
    />
    <el-dialog
      title="添加内部参会人员"
      :visible.sync="visible"
      width="800"
      custom-class="personnelDialog"
      @open="open"
      @close="close"
    >
      <div v-loading="loading">
        <div class="personnel-search">
          <el-input
            v-model="keyword"
            placeholder="请输入部门/人员名称"
            style="width: 250px"
          />
          <el-button
            type="primary"
            @click.native="searchByKeyword"
          >查询</el-button>
        </div>

        <div class="personnel-box">
          <div class="dept-tree">
            <el-tree
              ref="tree"
              :data="deptData"
              class="el-scrollbar"
              show-checkbox
              node-key="id"
              :props="props"
              :default-expanded-keys="defaultExpandedKeys"
              :default-checked-keys="defaultKeys"
              :filter-node-method="filterTree"
              @check-change="checkChange"
            >
              <span
                slot-scope="{ node, data }"
                :class="{
                  notCheck: !data.children,
                }"
              >
                <template v-if="!data.isUser">
                  <i
                    v-if="!node.expanded"
                    class="el-icon-folder"
                    style="margin-right: 5px"
                  />
                  <i
                    v-else
                    class="el-icon-folder-opened"
                    style="margin-right: 5px"
                  />
                </template>
                <span>{{ node.label }}</span>
              </span>
            </el-tree>

          </div>
          <div class="dept-info">
            <el-table :data="userData" style="width: 100%" border height="2">
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60"
              />
              <el-table-column prop="realName" label="姓名" align="center" />
              <el-table-column prop="departmentName" label="部门" align="center" />
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    class="remove"
                    @click="remove(scope.row, scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
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
import { queryDeptAndUser } from '@/api/currentMeeting'
import { mapState } from 'vuex'
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
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      users: '',
      keyword: '',
      deptData: [],
      loading: false,
      props: {
        label: 'deptName'
      },
      treeFlatList: [],
      userData: [],
      realUserData: [],
      defaultKeys: [],
      defaultExpandedKeys: []
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  watch: {
    value: {
      handler(n, o) {
        if (n) {
          this.users = n.map((i) => i.realName).join('、')
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    openDialog() {
      if (this.disabled) return
      this.visible = true
    },
    submit() {
      this.$emit('setVal', this.userData)
      this.users = this.userData.map((i) => i.username).join('、')
      this.visible = false
    },
    // 获取部门和用户
    queryDeptAndUser(flag) {
      return new Promise((resolve, reject) => {
        if (!this.deptData.length || flag) {
          this.loading = true
          queryDeptAndUser({ keyword: this.keyword })
            .then((res) => {
              const data = res.data
              this.handleTree(data)
              this.deptData = data
              resolve()
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          resolve()
        }
      })
    },
    handleTree(data) {
      data.forEach((item) => {
        if (item.staffList) {
          this.setUser(item)
        }
        if (!item.children) {
          return
        }

        this.handleTree(item.children)
      })
    },
    async searchByKeyword() {
      this.$refs.tree.filter(this.keyword)
    },
    filterTree(value, data) {
      if (!value) return true
      return data.deptName.indexOf(value) !== -1
    },
    setUser(item) {
      if (!item.staffList) {
        return
      }
      const that = this
      if (item.children) {
        item.children = item.children.concat(
          item.staffList.map((i) => {
            return {
              ...i,
              deptName: i.realName,
              departmentName: item.deptName,
              isUser: true,
              disabled: that.type && !i.txMeetingId,
              isLeaf: true
            }
          })
        )
      } else {
        item.children = item.staffList.map((i) => {
          return {
            ...i,
            deptName: i.realName,
            departmentName: item.deptName,
            isUser: true,
            isLeaf: true
          }
        })
      }
    },
    async open() {
      await this.queryDeptAndUser()
      if (!this.value) return
      this.userData = this.value
      this.$nextTick(() => {
        this.defaultExpandedKeys = this.userData.map((i) => i.id)
        this.$refs.tree.setCheckedKeys(this.userData.map((i) => i.id), true)
      })
    },
    close() {
      this.userData = []
      this.defaultKeys = []
      this.$refs.tree.setCheckedKeys([])
    },
    checkChange(val) {
      const data = this.$refs.tree.getCheckedNodes().filter(item => item.isUser)
      // // 去重
      const map = new Map()
      for (const item of data) {
        map.set(item.id, item)
      }
      this.userData = [...map.values()]
    },
    remove(item, i) {
      this.userData.splice(i, 1)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.userData.map((i) => i.id))
      })
      console.log(this.userData)
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
.personnelDialog {
  height: 60vh;
  display: flex;
  flex-direction: column;
  min-width: 700px;
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
    > div {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .personnel-search {
      display: flex;
      align-items: center;
      button {
        margin-left: 15px;
      }
    }
    .personnel-box {
      border: 1px solid #dbdbdb;
      flex: 1;
      overflow: auto;
      margin-top: 15px;
      display: flex;
      .dept-tree {
        flex: 0.5;
        border-right: 1px solid #dbdbdb;
        overflow-y: auto;
        padding: 20px 10px;
      }
      .dept-info {
        padding: 20px;
        display: flex;
        flex-direction: column;
        flex: 1;
        .el-table--medium td {
          padding: 2px 0;
        }
        .el-table--medium th {
          background: #e4e4e4;
          padding: 0;
        }
        .remove {
          color: red;
        }
      }
    }
  }
}
</style>
