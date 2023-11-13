<template>
  <div v-loading="loading" class="reservation-box">
    <div v-if="!detailsId && detailsId !== 0" class="reservation">
      <currentHeader :form="form" @query="submitQuery" />
      <div class="reservation-content">
        <el-table :data="tableData" style="width: 100%" height="250" border>
          <el-table-column
            type="index"
            label="序号"
            width="100"
            align="center"
          />
          <el-table-column prop="title" label="会议主题" align="center" />
          <el-table-column
            prop="time"
            label="会议时间"
            width="160"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.startTime | timeFilters }}</span>
              <br>
              <span>{{ scope.row.endTime | timeFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="conferenceName" label="空间" align="center" />
          <el-table-column prop="scheduleType" label="预约类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.scheduleType | scheduleTypeFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="会议状态" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status | statusFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="attendance" label="参会人数" align="center" />
          <el-table-column prop="userName" label="发起人" align="center" />
          <el-table-column
            fixed="right"
            label="操作"
            width="160"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"

                @click.native.prevent="hanldeDetail(scope.row)"
              >
                详情
              </el-button>
              <el-button
                v-if="scope.row.status !== 2"
                style="color: #9d9d9d"
                type="text"
                size="small"
                @click.native.prevent="cancel(scope.row)"
              >
                取消
              </el-button>
              <el-button
                v-if="scope.row.status !== 2"
                style="color: #eb5919"
                type="text"
                size="small"
                @click.native.prevent="leave(scope.row)"
              >
                结束
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          :current-page="pagination.page"
          :page-sizes="[20, 30, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <currentEdit
      v-else
      :id="detailsId"
      ref="currentEdit"
      :status-type="statusType"
      @goback="detailsId = null"
      @refresh="query"
    />
  </div>
</template>

<script>
import currentEdit from '@/views/meeting/currentMeeting/component/currentEdit.vue'
import currentHeader from './component/manageMeetingHeader.vue'
import { cancel } from '@/api/currentMeeting'
import { manageMeetingPage } from '@/api/manageMeeting'
import moment from 'moment'
const stastusList = [
  {
    label: '会议中',
    value: 1
  },
  {
    label: '已结束',
    value: 2
  },
  {
    label: '未开始',
    value: 0
  },
  {
    label: '已取消',
    value: 3
  }
]
const scheduleTypeList = [
  {
    label: '单次预约',
    value: 0
  },
  {
    label: '跨日预约',
    value: 1
  },
  {
    label: '重复预约（每日）',
    value: 3
  },
  {
    label: '重复预约（每周）',
    value: 4
  },
  {
    label: '重复预约（每月）',
    value: 5
  }
]
export default {
  name: '',
  components: {
    currentHeader,
    currentEdit
  },
  filters: {
    timeFilters(val) {
      return val ? moment(val).format('yyyy-MM-DD HH:mm:ss') : ''
    },
    statusFilters(val) {
      return stastusList.find((i) => i.value === val).label
    },
    scheduleTypeFilters(val) {
      return scheduleTypeList.find((i) => i.value === val).label
    }
  },
  data() {
    return {
      that: this,
      loading: false,
      search: {},
      tableData: [],
      form: {},
      pagination: {
        current: 1,
        size: 20
      },
      total: 0,
      detailsId: null,
      statusType: 'edit'
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    submitQuery() {
      this.pagination = {
        current: 1,
        size: 20
      }
      this.query()
    },
    query() {
      this.loading = true
      const form = JSON.parse(JSON.stringify(this.form))
      if (form.date?.length) {
        form.startDate = form.date[0]
        form.endDate = form.date[1]
        delete form.date
      }
      manageMeetingPage({
        param: { ...form },
        ...this.pagination
      })
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagination.size = val
      this.query()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pagination.current = val
      this.query()
    },

    // 编辑
    edit(row) {
      this.detailsId = row.id
      this.statusType = 'edit'
    },
    // 取消
    cancel(row) {
      this.$confirm('是否取消该会议?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          cancel(row.id)
            .then((res) => {
              this.$message.success('取消成功！')
              this.query()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },
    // 结束
    leave(row) {
      this.$confirm('是否结束该会议?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          cancel(row.id)
            .then((res) => {
              this.$message.success('结束成功！')
              this.query()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },
    // 详情
    hanldeDetail(row) {
      if ([0, 1].includes(row.scheduleType)) {
        this.detailsId = row.id
        this.statusType = 'detail'
      } else {
        // 跳转重复
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reservation-box {
  height: 100%;
  .reservation {
    box-shadow: 0px 3px 10px 0px rgba(6, 30, 84, 0.25);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #ffffff;
  }
  .reservation-content {
    margin: 0 15px 15px;
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
  .pagination {
    display: flex;
    padding: 0 10px 15px;
    justify-content: flex-end;
  }
}
</style>
