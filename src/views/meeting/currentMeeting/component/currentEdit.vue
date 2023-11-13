<template>
  <div v-loading="loading" class="currentEdit">
    <div class="edit-item">
      <div class="item-header">
        <div class="item-title header-title">会议信息</div>
        <div>
          <template v-if="statusType == 'edit'">
            <!-- <el-button
              type="primary"
              @click="visible = true"
            >发送通知</el-button> -->
            <el-button
              v-if="statusType == 'edit'"
              v-preventReClick
              type="primary"
              @click="submit"
            >保存
            </el-button>
          </template>
          <el-button @click="goback">返回</el-button>
        </div>
      </div>
      <div class="item-info">
        <p>会议室地址：{{ form && form.meetingRoomName ? form.meetingRoomName : "-" }}</p>
        <p>
          会议室设备：{{
            form && form.deviceServiceList ? form.deviceServiceList : "-"
          }}
        </p>
        <p>预约类型：{{ scheduleName }}</p>
      </div>
    </div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
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
            :disabled="statusType != 'edit'"
          />
        </el-form-item>
        <el-form-item label="会议时间：" prop="name">
          <el-date-picker
            v-model="form.date"
            disabled
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 380px"
          />
        </el-form-item>
        <el-form-item label="会议类型：" prop="region">
          <el-select
            v-model="form.type"
            placeholder="请选择会议类型"
            style="width: 380px"
            :disabled="statusType != 'edit'"
            @change="changeMeetingType"
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
              :disabled="statusType != 'edit'"
              placeholder="请输入会议链接"
              style="width: 380px"
            />
          </el-form-item>
          <el-form-item label="会议号：" prop="meetingNumber">
            <el-input
              v-model="form.meetingNumber"
              :disabled="statusType != 'edit'"
              placeholder="请输入会议号"
              style="width: 380px"
            />
          </el-form-item>
        </template>
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

        <el-form-item label="内部参会人员：" prop="name">
          <!-- <el-input
            v-model="form.name"
            placeholder="请选择内部参会人员"
            style="width: 380px"
          /> -->
          <personnel
            :value="form.meetingInnerParticipantList"
            :disabled="statusType === 'detail'"
            style="width: 380px"
            @setVal="setVal"
          />
        </el-form-item>
        <el-form-item label="外部参会人员：" prop="name">
          <outsiders
            :value="form.meetingOutsideParticipantList"
            :disabled="statusType === 'detail'"
            style="width: 380px"
            @setVal="setExternal"
          />
        </el-form-item>
      </div>
      <div class="edit-item">
        <div class="item-title">会议服务</div>
        <el-form-item label="茶水服务：" prop="region">
          <el-select
            v-model="form.teaServiceList"
            filterable
            multiple
            placeholder="请选择茶水服务"
            style="width: 380px"
            :disabled="statusType != 'edit'"
          >
            <el-option
              v-for="(item, i) in teaServiceList"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.teaServiceList&&form.teaServiceList.length>0" label="">
          <div style="display: flex;flex-wrap: wrap;width: 800px;">
            <template
              v-for="(item, i) in teaServiceList"
            >
              <div
                v-if="form.teaServiceList.includes(item.id)"
                :key="i"
                class="box_tea_style"
              >
                <span style="width: 90px;">{{ item.name }}:</span>
                <el-input v-model="item.number" :disabled="statusType != 'edit'" type="number" />
              </div>
            </template>

          </div>
        </el-form-item>
        <el-form-item label="设备服务：" prop="region">
          <el-select
            v-model="form.deviceServiceIdList"
            filterable
            multiple
            placeholder="请选择设备服务"
            style="width: 380px"
            :disabled="statusType != 'edit'"
          >
            <el-option
              v-for="(item, i) in deviceList"
              :key="i"
              :label="item.name"
              :value="item.id"
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
            :disabled="statusType != 'edit'"
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
import {
  getCurrentDetails,
  manageMeetingServices,
  meetingEdit
} from '@/api/currentMeeting'
import moment from 'moment'
import personnel from '@/components/personnel'
import outsiders from '@/components/outsiders'
import { MeetingTypeList } from '@/utils/constants'
import { manageMeetingServicesList } from '@/api/reservation'

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
const meetingTypeList = MeetingTypeList
export default {
  name: '',
  components: {
    personnel,
    outsiders
  },
  props: {
    id: {
      type: String,
      default: null
    },
    statusType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      radio: 1,
      srcForm: {},
      form: {},
      meetingTypeList, // 会议类型
      visible: false,
      teaServiceList: [],
      teaList: [],
      deviceList: [],
      rules: {
        onlineMeetingUrl: [{ required: true, trigger: 'change', message: '请输入会议链接' }],
        meetingNumber: [{ required: true, trigger: 'change', message: '请输入会议号' }]
      }
    }
  },
  computed: {
    scheduleName() {
      if (Object.keys(this.form).length !== 0) {
        return this.form.scheduleType || this.form.scheduleType === 0 ? scheduleTypeList.find((i) => i.value === this.form.scheduleType).label : ''
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
  async mounted() {
    await this.machineListFun(0)
    await this.getCurrentDetails()
    await this.manageMeetingServices()
  },
  methods: {
    machineListFun(type) {
      manageMeetingServicesList({ type: type, optionFlag: type === 1 ? 1 : '' }).then((res) => {
        if (type === 1) {
          this.deviceList = res.data
        } else {
          res.data.forEach(item => {
            item.number = 0
          })
          this.teaServiceList = res.data
        }
      })
    },
    // 保存
    submit() {
      const that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.form.meetingPassword && this.form.meetingPassword.length < 4) {
            this.$message({
              message: '会议密码最少为4位',
              type: 'warning'
            })
            return
          }
          this.loading = true
          const datas = JSON.parse(JSON.stringify(that.form))
          datas.teaServiceList = []
          this.teaServiceList.forEach(items => {
            if (this.form.teaServiceList.includes(items.id)) {
              datas.teaServiceList.push({
                servicesId: items.id,
                number: items.number
              })
            }
          })
          meetingEdit({
            ...datas,
            id: that.id
          })
            .then((res) => {
              that.$message.success('保存成功!')
              that.goback()
              that.$emit('refresh')
            })
            .finally(() => {
              that.loading = false
            })
        }
      })
    },
    changeMeetingType() {
      if (this.form.type === this.srcForm.type) {
        this.form = {
          ...this.form,
          onlineMeetingUrl: this.srcForm.onlineMeetingUrl,
          meetingNumber: this.srcForm.meetingNumber,
          meetingPassword: this.srcForm.meetingPassword
        }
      } else {
        this.form = {
          ...this.form,
          onlineMeetingUrl: '',
          meetingNumber: '',
          meetingPassword: ''
        }
      }
    },
    getCurrentDetails() {
      this.loading = true
      getCurrentDetails(this.id)
        .then((res) => {
          const datas = JSON.parse(JSON.stringify(res.data))
          datas.teaServiceList = []
          if (res.data.teaServiceList) {
            this.teaServiceList.forEach(c => {
              res.data.teaServiceList.forEach(b => {
                if (c.id === b.servicesId) {
                  datas.teaServiceList.push(c.id)
                  c.number = b.number
                }
              })
            })
          }
          this.form = datas
          this.machineListFun(1)
          this.srcType = this.form.type
          if (this.form.startTime && this.form.endTime) {
            this.form.date = [this.form.startTime, this.form.endTime]
          }
          console.log(JSON.parse(JSON.stringify(this.form)))
        })
        .finally(() => {
          this.loading = false
        })
    },
    goback() {
      this.$emit('goback')
    },
    // 发送通知
    noticee() {
      this.$message.success('发送成功！')
      this.visible = false
    },
    // 赋值内部人员
    setVal(data) {
      if (data?.length) {
        this.form.meetingInnerParticipantList = data
        this.form.meetingInnerParticipantIdList = data.map((i) => i.id)
      }
    },
    setExternal(data) {
      if (data?.length) {
        this.form.meetingOutsideParticipantList = data
      }
    },
    // 获取会议服务
    manageMeetingServices() {
      manageMeetingServices({
        page: 0,
        pageSize: 0
      }).then((res) => {
        console.log(res)
      })
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
.box_tea_style{
  width: 200px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
