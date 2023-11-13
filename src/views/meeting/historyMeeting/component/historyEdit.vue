<template>
  <div class="currentEdit">
    <span
      class="goback"
      @click="goback"
    ><i class="el-icon-back" /> 返回当前会议列表</span>
    <div class="edit-item">
      <div class="item-header">
        <div class="item-title header-title">会议信息</div>
        <div>
          <el-button type="primary" @click="visible = true">发送通知</el-button>
          <el-button type="primary">保存</el-button>
        </div>
      </div>
      <div class="item-info">
        <p>会议室地址：{{ form && form.localtion ? form.localtion : "-" }}</p>
        <p>会议室设备：{{ form && form.localtion ? form.localtion : "-" }}</p>
        <p>预约类型：{{ scheduleName }}</p>
      </div>
    </div>
    <el-form ref="ruleForm" :model="form" label-width="120px">
      <div class="edit-item">
        <div class="item-title">基本信息</div>
        <el-form-item label="会议信息：" prop="name">
          <el-radio v-model="radio" :label="1">{{ "公开" }}</el-radio>
        </el-form-item>
        <el-form-item label="会议主题：" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入会议主题"
            style="width: 380px"
          />
        </el-form-item>
        <el-form-item label="会议时间：" prop="name">
          <el-date-picker
            v-model="form.date"
            disabled
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-DD HH:mm:ss"
            style="width: 380px"
          />
        </el-form-item>
        <el-form-item label="会议类型：" prop="region">
          <el-select
            v-model="form.meetingType"
            placeholder="请选择会议类型"
            style="width: 380px"
          >
            <el-option
              v-for="(item, i) in meetingTypeList"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内部参会人员：" prop="name">
          <!-- <el-input
            v-model="form.name"
            placeholder="请选择内部参会人员"
            style="width: 380px"
          /> -->
          <personnel v-model="form.name" style="width: 380px" />
        </el-form-item>
        <el-form-item label="外部参会人员：" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请选择外部参会人员"
            style="width: 380px"
          />
        </el-form-item>
      </div>
      <div class="edit-item">
        <div class="item-title">会议服务</div>
        <el-form-item label="茶水服务：" prop="region">
          <el-select
            v-model="form.meetingType"
            placeholder="请选择茶水服务"
            style="width: 380px"
          >
            <el-option
              v-for="(item, i) in meetingTypeList"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="会议类型：" prop="region">
          <el-select
            v-model="form.meetingType"
            placeholder="请选择设备服务"
            style="width: 380px"
          >
            <el-option
              v-for="(item, i) in meetingTypeList"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="edit-item">
        <div class="item-title">{{ "其他备注" }}</div>
        <el-form-item label="备注：" prop="region">
          <el-input
            v-model="form.remark"
            type="textarea"
            :autosize="{ minRows: 3 }"
            placeholder="请输入备注"
          />
        </el-form-item>
      </div>
    </el-form>
    <el-dialog
      title="会议信息"
      :visible.sync="visible"
      width="480px"
      custom-class="noticeeDialog"
      top="30vh"
    >
      <p>{{ form.userName }} 邀请您参加会议</p>
      <p>会议主题：{{ form.title || "-" }}</p>
      <p>会议时间：{{ form.date ? meetingDate : "-" }}</p>
      <p>会议室地址：{{ form.localtion || "-" }}</p>
      <p>其他说明：{{ form.remark || "-" }}</p>
      <span slot="footer">
        <el-button v-preventReClick type="primary" @click="noticee">确认发送</el-button>
        <el-button @click="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentDetails } from '@/api/currentMeeting'
import moment from 'moment'
import personnel from '@/components/personnel'
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
    personnel
  },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      radio: 1,
      form: {},
      meetingTypeList: [],
      visible: false
    }
  },
  computed: {
    scheduleName() {
      if (Object.keys(this.form).length !== 0) {
        return scheduleTypeList.find((i) => i.value === this.form.scheduleType)
          .label
      } else {
        return '-'
      }
    },
    meetingDate() {
      return `${moment(this.form.date[0]).format('yyyy/MM/DD HH:mm')}-${moment(
        this.form.date[1]
      ).format('HH:mm')}`
    }
  },
  mounted() {
    this.getCurrentDetails()
  },
  methods: {
    getCurrentDetails() {
      getCurrentDetails(this.id).then((res) => {
        this.form = res.data
        if (this.form.startTime && this.form.endTime) {
          this.form.date = [this.form.startTime, this.form.endTime]
        }
        console.log(JSON.parse(JSON.stringify(this.form)))
      })
    },
    goback() {
      this.$emit('goback')
    },
    // 发送通知
    noticee() {
      this.$message.success('发送成功！')
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.currentEdit {
  height: 100%;
  overflow: auto;
  padding: 10px;
  margin: -10px;
  .goback {
    position: fixed;
    top: 78px;
    left: 200px;
    z-index: 66;
    font-size: 14px;
    color: #666;
    cursor: pointer;
  }
  .edit-item {
    background: #ffffff;
    box-shadow: 0px 3px 10px 0px rgba(6, 30, 84, 0.25);
    padding: 10px 20px;
    margin-bottom: 15px;
    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .header-title {
        padding: 0;
      }
    }
    .item-title {
      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      color: #acacac;
      letter-spacing: 0.64px;
      padding: 10px 0;
    }
    .item-info {
      padding-left: 40px;
      p {
        margin-bottom: 10px;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        color: #6d6d6d;
        letter-spacing: 0.56px;
      }
    }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>

<style lang="scss">
.noticeeDialog {
  border-radius: 10px;
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
    padding: 0 40px;
  }
  .el-dialog__footer {
    text-align: center;
  }
}
</style>
