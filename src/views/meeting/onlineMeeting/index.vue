<template>
  <div v-loading="loading" class="reservation-box">
    <div class="currentEdit">
      <div class="edit-item">
        <div class="item-header">
          <div class="item-title header-title">会议信息</div>
          <div>
            <!-- <el-button type="primary" @click="visible = true">发送通知</el-button> -->
            <el-button v-preventReClick type="primary" @click="saveFun">保存</el-button>
            <el-button @click="goback">返回</el-button>
          </div>
        </div>
        <div class="item-info">
          <p>线上会议</p>
          <!-- <p>预约类型：腾讯会议</p> -->
        </div>
      </div>
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
        <div class="edit-item">
          <div class="item-title">基本信息</div>
          <el-form-item label="会议信息：" prop="name">
            <el-radio v-model="radio" :label="1">{{ '公开' }}</el-radio>
          </el-form-item>
          <el-form-item label="会议主题：" prop="subject">
            <el-input
              v-model="form.subject"
              placeholder="请输入会议主题"
              style="width: 380px"
            />
          </el-form-item>
          <el-form-item label="会议时间：" prop="date">
            <el-date-picker
              v-model="form.date"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 380px"
            />
          </el-form-item>
          <el-form-item label="会议类型：" prop="type">
            <el-select
              v-model="form.type"
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
          <template v-if="form.type!==0">
            <el-form-item label="会议链接：" prop="onlineMeetingUrl">
              <el-input
                v-model="form.onlineMeetingUrl"
                placeholder="请输入会议链接"
                style="width: 380px"
              />
            </el-form-item>
            <el-form-item label="会议号：" prop="meetingNumber">
              <el-input
                v-model="form.meetingNumber"
                placeholder="请输入会议号"
                style="width: 380px"
              />
            </el-form-item>
            <el-form-item v-if="form.type!==0" label="会议密码：">
              <el-input
                v-model="form.meetingPassword"
                :disabled="statusType === 'detail'"
                placeholder="请输入会议密码"
                minlength="4"
                maxlength="6"
                style="width: 380px"
              />
            </el-form-item>
          </template>
          <el-form-item label="内部参会人员：">
            <!-- <el-input
              v-model="form.name"
              placeholder="请选择内部参会人员"
              style="width: 380px"
            /> -->
            <personnel
              v-model="form.invitees"
              style="width: 380px"
              type="online"
              @setVal="setVal"
            />
          </el-form-item>
          <!-- <el-form-item label="外部参会人员：" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请选择外部参会人员"
              style="width: 380px"
            />
          </el-form-item> -->
        </div>
        <!-- <div class="edit-item">
          <div class="item-title">{{ form.a ? "其他备注" : "会议链接" }}</div>
          <el-form-item label="备注：" prop="region">
            <el-input
              v-model="form.remark"
              type="textarea"
              :autosize="{ minRows: 3 }"
              placeholder="请输入备注"
            />
          </el-form-item>
        </div> -->
      </el-form>
      <div v-if="txdata.meetingNumber&&txdata.meetingNumber>0" class="edit-item">
        <div class="item-header">
          <div class="item-title header-title">腾讯会议列表</div>
        </div>
        <div class="item-info">
          <p v-for="item in txdata.meetingInfoVoList" :key="item.meetingCode">
            {{ item.subject }}（{{ item.joinUrl }}）
          </p>
        </div>
      </div>
      <el-dialog
        title="会议信息"
        :visible.sync="visible"
        width="480px"
        custom-class="noticeeDialog"
        top="30vh"
      >
        <p>{{ form.userName }} 邀请您参加会议</p>
        <p>会议主题：{{ form.title || '-' }}</p>
        <p>会议时间：{{ form.date ? meetingDate : '-' }}</p>
        <p>会议室地址：{{ form.localtion || '-' }}</p>
        <p>其他说明：{{ form.remark || '-' }}</p>
        <span slot="footer">
          <el-button v-preventReClick type="primary" @click="noticee">确认发送</el-button>
          <el-button @click="visible = false">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import personnel from '@/components/personnel'
import { scheduleMeeting, queryTxMeetingList } from '@/api/currentMeeting'
import { MeetingTypeList } from '@/utils/constants'
// const scheduleTypeList = [
//   {
//     label: '单次预约',
//     value: 0
//   },
//   {
//     label: '跨日预约',
//     value: 1
//   },
//   {
//     label: '重复预约（每日）',
//     value: 3
//   },
//   {
//     label: '重复预约（每周）',
//     value: 4
//   },
//   {
//     label: '重复预约（每月）',
//     value: 5
//   }
// ]
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
      loading: false,
      radio: 1,
      txdata: {},
      rules: {
        subject: [{ required: true, trigger: 'change', message: '请输入会议主题' }],
        date: [{ required: true, trigger: 'change', message: '请选择会议时间' }],
        type: [{ required: true, trigger: 'change', message: '请选择会议类型' }],
        onlineMeetingUrl: [{ required: true, trigger: 'change', message: '请输入会议链接' }],
        meetingNumber: [{ required: true, trigger: 'change', message: '请输入会议号' }]
      },
      invitees: [],
      form: {
        subject: '',
        date: '',
        type: '',
        invitees: [],
        scheduleType: ''
      },
      meetingTypeList: MeetingTypeList,
      visible: false
    }
  },
  computed: {
    // scheduleName() {
    //   if (Object.keys(this.form).length !== 0) {
    //     return scheduleTypeList.find((i) => i.value === this.form.scheduleType)
    //       .label
    //   } else {
    //     return '-'
    //   }
    // },
    meetingDate() {
      return `${moment(this.form.date[0]).format('yyyy/MM/DD HH:mm')}-${moment(
        this.form.date[1]
      ).format('HH:mm')}`
    }
  },
  mounted() {
  },
  methods: {
    queryTxMeetingListFun() {
      queryTxMeetingList({}).then((res) => {
        this.txdata = res.data
      })
    },
    setVal(datas) {
      const arr = []
      datas.forEach((element) => {
        arr.push(element.id)
      })
      this.invitees = arr
    },
    saveFun() {
      const that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const datas = { ...that.form }
          datas.startTime = datas.date[0]
          datas.endTime = datas.date[1]
          datas.invitees = that.invitees
          scheduleMeeting(datas).then((res) => {
            that.$message({
              message: '保存成功',
              type: 'success'
            })
            that.$refs['ruleForm'].resetFields()
            that.form.invitees = []
            that.queryTxMeetingListFun()
          })
        }
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

    // .el-form-item {
    //   margin-bottom: 10px;
    // }
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
