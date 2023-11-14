<template>
  <div v-loading="loading" class="reservation">
    <reservationHeader
      :form="form"
      :device-list="deviceList"
      @change="headerChange"
    />
    <div
      v-infinite-scroll="load"
      :infinite-scroll-distance="50"
      :infinite-scroll-immediate="false"
      class="reservation-content"
    >
      <div class="content-title">
        <div class="title-l">会议室信息</div>
        <div class="title-r">
          <div v-for="(item, i) in tips" :key="i" class="title-item">
            <div class="tips-color" :style="{ background: item.color }" />
            <span>{{ item.text }}</span>
          </div>
        </div>
      </div>
      <!-- <div > -->
      <div v-for="(item, i) in domList" :key="i" class="meeting-item">
        <div class="meeting-info">
          <div class="info-t">
            <img :src="item.coverPicture" alt="">
            <div class="deeting-details">
              <div class="details-t">
                <div>
                  <img src="@/assets/meeting/floor.png" alt="">
                  {{ item.floor }}
                </div>
                <div>
                  <img src="@/assets/meeting/people.png" alt="">
                  {{ item.capacity || "" }}
                </div>
              </div>
              <!--              <div class="details-b">-->
              <!--                <img src="@/assets/meeting/address.png" alt="">-->
              <!--                {{ item.localtion }}-->
              <!--              </div>-->
            </div>
          </div>
          <div class="meeting-name">{{ item.conferenceName }}</div>
          <div class="info-b">
            <span
              v-for="(device, devicesI) in item.machineServiceNameList"
              :key="devicesI"
              class="device"
            >
              {{ device }}
            </span>
          </div>
        </div>
        <div class="meeting-time">
          <div class="time-box">
            <div
              v-for="(time, timeI) in item.dates"
              :key="timeI"
              class="time-item"
            >
              <div class="hour">
                {{ time.hour }}
              </div>
              <div class="minutes">
                <template v-if="time.meetingInfo">
                  <el-tooltip
                    class="item"
                    effect="light"
                    :disabled="!time.meetingInfo"
                    placement="bottom"
                    :open-delay="300"
                  >
                    <div slot="content">
                      {{ `会议主题：${time.meetingInfo.meetingName}` }}
                      <br>
                      {{ `开始时间：${time.meetingInfo.startTime}` }}
                      <br>
                      {{ `结束时间：${time.meetingInfo.endTime}` }}
                      <br>
                      {{ `会议状态：${time.meetingInfo.title}` }}
                      <br>
                    </div>
                    <div
                      :style="{ background: time.color }"
                      :class="{
                        notSelect: time.notSelect,
                      }"
                      @click="timeClick(time, item)"
                    />
                  </el-tooltip>
                </template>
                <template v-else>
                  <div
                    :style="{ background: time.color }"
                    :class="{
                      notSelect: time.notSelect,
                    }"
                    @click="timeClick(time, item)"
                  />

                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </div>
    <!-- <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="1000">
      </el-pagination>
    </div> -->
    <el-dialog
      title="重复预约时间设置"
      :visible.sync="repeatVisible"
      width="35%"
    >
      <el-form
        ref="repeatForm"
        size="medium"
        :rules="repeatFormRules"
        :model="repeatForm"
        label-position="left"
        label-width="120px"
        style="width: 95%; margin-left: 10px"
      >
        <el-form-item label="重复预约类型" prop="type">
          <el-select v-model="repeatForm.type" placeholder="请选择重复预约类型">
            <el-option
              v-for="item in repeatTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="重复截止时间" prop="repetitionEndDate">
          <el-date-picker
            v-model="repeatForm.repetitionEndDate"
            width="100%"
            :picker-options="endDatePickerOptions"
            type="date"
            placeholder="请选择重复截止时间"
          />
        </el-form-item>
        <span class="repeat-form-tip">重复截止时间不能超过180天</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="repeatVisible = false">取 消</el-button>
        <el-button type="primary" @click="scheduled('repeat')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="跨日预约时间设置"
      :visible.sync="toNextVisible"
      width="30%"
    >
      <el-form
        ref="toNextForm"
        size="medium"
        :rules="toNextFormRules"
        :model="toNextForm"
        label-position="left"
        label-width="90px"
        style="width: 95%; margin-left: 10px"
      >
        <el-form-item label="开始时间:" prop="startDate">
          <el-date-picker
            v-model="toNextForm.startDate"
            value-format="yyyy-MM-dd"
            width="100%"
            :picker-options="endDatePickerOptions"
            type="date"
            placeholder="日期"
          />
          <el-time-select
            v-model="toNextForm.startTime"
            class="mr-2"
            placeholder="开始时间"
            :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }"
            clearable
            style="margin-left: 10px; width: 130px"
          />
        </el-form-item>
        <el-form-item label="结束时间:" prop="endDate">
          <el-date-picker
            v-model="toNextForm.endDate"
            value-format="yyyy-MM-dd"
            width="100%"
            :picker-options="endDatePickerOptions"
            type="date"
            placeholder="日期"
          />
          <el-time-select
            v-model="toNextForm.endTime"
            class="mr-2"
            placeholder="结束时间"
            :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }"
            clearable
            style="margin-left: 10px; width: 130px"
          />
        </el-form-item>
        <span style="float: right">最长跨日时间段为180天</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toNextVisible = false">取 消</el-button>
        <el-button type="primary" @click="scheduled('toNext')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import reservationHeader from './component/reservationHeader.vue'
import {
  queryConferenceMeetings,
  scheduled,
  repetitionScheduled,
  manageMeetingServicesList
} from '@/api/reservation'

export default {
  name: '',
  components: {
    reservationHeader
  },
  data() {
    const validateStartTime = (rule, value, callback) => {
      if (!this.toNextForm.startTime || !value) {
        callback(new Error('开始时间不能为空'))
      } else {
        callback()
      }
    }
    const validateEndTime = (rule, value, callback) => {
      if (!this.toNextForm.endTime || !value) {
        callback(new Error('结束时间不能为空'))
      } else {
        callback()
      }
    }
    return {
      domList: [],
      apis: {
        common: scheduled,
        repeat: repetitionScheduled,
        toNext: scheduled
      },
      loading: false,
      tips: [
        {
          text: '可预约',
          color: '#fffff'
        },
        {
          text: '已过期',
          color: '#FF7C62'
        },
        {
          text: '已预约',
          color: '#38C095'
        },
        {
          text: '已选中',
          color: '#2486EE'
        }
      ],
      meetingList: [],
      form: { date: '' },
      deviceList: [],
      allDate: [],
      activeRow: null,
      repeatVisible: false,
      toNextVisible: false,
      repeatTypeOptions: [
        {
          name: '每日',
          value: 0
        },
        {
          name: '每周',
          value: 1
        },
        {
          name: '每月',
          value: 2
        }
      ],
      repeatForm: {
        type: 0,
        repetitionEndDate: ''
      },
      toNextForm: {
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: ''
      },
      endDatePickerOptions: {
        disabledDate: (date) => {
          const endDate = this.$moment().add(180, 'day').format('YYYY-MM-DD')
          const startDate = this.$moment()
            .subtract(1, 'day')
            .format('YYYY-MM-DD')
          return (
            date.getTime() > new Date(endDate).getTime() ||
            date.getTime() <= new Date(startDate).getTime()
          )
        }
      },
      repeatFormRules: {
        type: [
          { required: true, message: '重复类型不能为空', trigger: 'change' }
        ],
        repetitionEndDate: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ]
      },
      toNextFormRules: {
        startDate: [{ validator: validateStartTime, trigger: 'change' }],
        endDate: [{ validator: validateEndTime, trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.query()
    this.machineListFun()
  },
  methods: {
    load() {
      if (
        this.meetingList.length === this.domList.length ||
        this.meetingList.length < this.domList.length
      ) {
        return
      }
      const arr = this.meetingList.slice(
        this.domList.length,
        this.domList.length + 5
      )
      console.log(arr)
      this.domList = [...this.domList, ...arr]
    },
    machineListFun() {
      manageMeetingServicesList({ type: 1 }).then((res) => {
        this.deviceList = res.data
      })
    },
    headerChange(type) {
      this[type]()
    },
    // 设置初始时间
    getDates() {
      this.allDate = []
      for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 4; j++) {
          // TODO Safari时间处理会导致ISO问题
          this.allDate.push({
            color: '',
            hour: i < 10 ? `0${i}:00` : `${i}:00`,
            time: this.$moment(`${this.form.date} ${i < 10 ? `0${i}` : i}:${j === 0 ? '00' : j * 15}`).local().format(
              'YYYY-MM-DD HH:mm:ss'
            )
          })
        }
      }
      this.setInitColor()
    },
    // 设置初始颜色
    setInitColor() {
      //   设置初始color
      // 当前时间
      const nowStamp = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      this.allDate.forEach((item) => {
        item.color = '#fff'
        item.notSelect = false
        if (item.time < nowStamp) {
          item.color = '#eee'
          item.notSelect = true
        }
      })
      this.meetingList.forEach((item) => {
        item.dates = JSON.parse(JSON.stringify(this.allDate))
        if (item.meetingList.length) {
          item.meetingList.forEach((mDate) => {
            // 判断会议状态 1.已预约 2.已过期
            mDate.type = nowStamp <= mDate.endTime ? 1 : 2
            item.dates.forEach((aDate) => {
              if (
                // mDate.startTime <= this.$moment(aDate.time).valueOf() &&
                // mDate.endTime > this.$moment(aDate.time).valueOf()
                mDate.startTime <= aDate.time &&
                mDate.endTime > aDate.time
              ) {
                aDate.color = mDate.type === 1 ? '#38C095' : '#FF7C62'
                aDate.notSelect = true
                aDate.meetingInfo = {
                  startTime: mDate.startTime,
                  endTime: mDate.endTime,
                  // startTime: this.$moment(mDate.startTime).format(
                  //   'YYYY-MM-DD HH:mm:00'
                  // ),
                  // endTime: this.$moment(mDate.endTime).format(
                  //   'YYYY-MM-DD HH:mm:00'
                  // ),
                  meetingName: mDate.title,
                  title: mDate.type === 1 ? '已预约' : '已过期'
                }
              }
            })
          })
        }
      })
      this.domList = this.meetingList.slice(0, 5)
    },

    timeClick(row, item) {
      if (row.notSelect) return
      this.setDate(row.time, item)
    },
    // 赋值点击时间
    setDate(date, row) {
      // 去掉其他会议室已点击时间
      this.dateResetting(row)
      if (!row.activeStart) {
        // 第一次点击 赋值时间
        row.activeStart = date
        row.activeEnd = this.$moment(date)
          .add(15, 'm')
          .format('YYYY-MM-DD HH:mm')
      } else {
        // 第二次点击 更新时间 判断点击前、中、后
        if (
          this.$moment(date).valueOf() ===
          this.$moment(row.activeStart).valueOf()
        ) {
          // 点击当前开始时间 删除点击时间
          row.activeStart = ''
          row.activeEnd = ''
        } else if (
          this.$moment(date).valueOf() < this.$moment(row.activeStart).valueOf()
        ) {
          if (this.judgingDisabled(row, date, row.activeEnd)) {
            // 更新开始时间
            row.activeStart = date
          } else {
            return this.$message.warning('该时间段不可选择')
          }
        } else if (
          this.$moment(date).valueOf() > this.$moment(row.activeStart).valueOf()
        ) {
          // 更新结束时间
          if (this.judgingDisabled(row, row.activeStart, date)) {
            row.activeEnd = this.$moment(date)
              .add(15, 'm')
              .format('YYYY-MM-DD HH:mm')
          } else {
            return this.$message.warning('该时间段不可选择')
          }
        }
      }
      if (row.activeStart) {
        this.activeRow = {
          ...row,
          startTime: row.activeStart,
          endTime: row.activeEnd
        }
      } else {
        this.activeRow = null
      }
      this.setColor(row)
      // console.log(row.name, "\n", row.activeStart, "\n", row.activeEnd);
    },
    // 判断中间是否有禁选时间
    judgingDisabled(row, startTime, endTime) {
      // console.log(row, startTime, endTime)
      let flag = true
      row.dates.forEach((item) => {
        if (
          this.$moment(item.time).valueOf() >
            this.$moment(startTime).valueOf() &&
          this.$moment(item.time).valueOf() <
            this.$moment(endTime).add(-15, 'm').valueOf() &&
          item.notSelect
        ) {
          console.log()
          flag = false
        }
      })
      return flag
    },
    // 赋值点击颜色
    setColor(row) {
      row.dates.forEach((item) => {
        if (item.color === '#2486EE') {
          item.color = '#fff'
        }
        // console.log(item.time >= row.activeStart && item.time < row.activeEnd);
        if (item.time >= row.activeStart && item.time < row.activeEnd) {
          item.color = '#2486EE'
          // console.log(item);
        }
      })
    },
    // 去掉其他会议室已点击时间
    dateResetting(row) {
      this.meetingList.forEach((item) => {
        item.dates.forEach((dItem) => {
          if (
            dItem.color === '#2486EE' &&
            item.conferenceId !== row.conferenceId
          ) {
            dItem.color = '#fff'
            item.activeStart = ''
            item.activeEnd = ''
          }
        })
      })
    },
    query() {
      // 初始时间数组 否则点击无效
      this.loading = true
      const datas = { ...this.form }
      datas.machineServiceIdList = datas.machineServiceIdList
        ? datas.machineServiceIdList.join(',')
        : ''
      queryConferenceMeetings(datas)
        .then((res) => {
          // this.meetingList = res.data;
          this.meetingList = res.data.map((item) => {
            return {
              ...item,
              dates: []
            }
          })
          this.getDates()
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 线上预约
    online() {
      this.$router.push({ name: 'onlineMeeting' })
    },
    // 跨天会议展示
    showToNext() {
      if (!this.activeRow) {
        return this.$message.warning('未选择会议时间')
      }
      const start = this.activeRow.startTime.split(' ')
      const end = this.activeRow.endTime.split(' ')
      console.log(start, end)
      this.toNextForm = {
        startDate: start[0],
        endDate: end[0],
        startTime: start[1],
        endTime: end[1]
      }
      this.toNextVisible = true
    },
    // 跨天会议展示
    showRepeat() {
      if (!this.activeRow) {
        return this.$message.warning('未选择会议时间')
      }
      this.repeatVisible = true
    },
    // 预约会议
    scheduled(type) {
      if (!type) {
        type = 'common'
      }
      if (!this.activeRow) {
        return this.$message.warning('未选择会议时间')
      }
      let data = {
        meetingRoomId: this.activeRow.conferenceId,
        startTime: `${this.activeRow.startTime}:00`,
        endTime: `${this.activeRow.endTime}:00`
      }
      let valid = true
      if (type === 'repeat') {
        this.$refs.repeatForm.validate((validate) => {
          valid = validate
          if (valid) {
            this.repeatForm.repetitionEndDate = this.$moment(
              this.repeatForm.repetitionEndDate
            ).format('YYYY-MM-DD')
            data = { ...data, ...this.repeatForm }
          }
        })
      }
      if (type === 'toNext') {
        this.$refs.toNextForm.validate((validate) => {
          valid = validate
          if (valid) {
            const startTime = `${this.toNextForm.startDate} ${this.toNextForm.startTime}:00`
            const endTime = `${this.toNextForm.endDate} ${this.toNextForm.endTime}:00`
            data = { ...data, startTime, endTime }
          }
        })
      }
      if (!valid) {
        return
      }
      this.loading = true
      this.apis[type](data)
        .then(({ code, data }) => {
          if (code === 70006) {
            this.query()
          }
          this.activeRow = null
          this.$confirm('预约成功，是否继续添加会议链接和参会人?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'success'
          })
            .then(() => {
              this.$router.push({
                path: '/currentMeeting',
                query: { meetingId: data, type: 'edit' }
              })
            })
            .catch(() => {
              this.query()
            })
        })
        .finally(() => {
          this.loading = false
          this.repeatVisible = false
          this.toNextVisible = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.reservation {
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 3px 10px 0px rgba(6, 30, 84, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .reservation-content {
    margin: 0 15px 15px;
    border: 1px solid #dcdcdc;
    flex: 1;
    overflow: auto;

    .content-title {
      display: flex;
      position: sticky;
      top: 0;
      background: #fff;
      border-bottom: 1px solid #efefef;

      .title-l {
        width: 240px;
        border-right: 1px solid #efefef;
        padding: 5px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        color: #cccccc;
        line-height: 30px;
        letter-spacing: 0.64px;
      }

      .title-r {
        flex: 1;
        display: flex;
        align-items: center;
        padding-left: 20px;

        .title-item {
          margin-right: 20px;
          display: flex;
          align-items: center;
          letter-spacing: 0.56px;
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          color: #b7becd;

          &:first-child .tips-color {
            border: 1px solid #c3c3c3;
            box-sizing: border-box;
          }

          .tips-color {
            width: 16px;
            height: 16px;
            margin-right: 5px;
          }
        }
      }
    }

    .meeting-item {
      display: flex;
      // min-height: 200px;
      min-height: 20%;
      padding-bottom: 1%;
      border-bottom: 1px solid #efefef;

      .meeting-info {
        width: 240px;
        border-right: 1px solid #efefef;
        display: flex;
        flex-direction: column;

        .info-t {
          display: flex;
          // align-items: center;
          padding: 5px;

          img {
            width: 70px;
            height: 60px;
            border-radius: 4px;
            margin-right: 10px;
          }

          .deeting-details {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            color: #d0d2dc;
            letter-spacing: 0.64px;
            padding: 0 10px;

            img {
              width: 17px;
              height: 17px;
              margin-right: 10px;
            }

            .details-t {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;

              > div {
                display: flex;
                align-items: center;
                // margin-right: 20px;
              }
            }

            .details-b {
              width: 100%;
              display: flex;
              align-items: center;

              font-size: 14px;
              margin-top: 10px;
            }
          }
        }

        .meeting-name {
          padding: 5px 10px;
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: bold;
          color: #061e54;
          letter-spacing: 0.72px;
        }

        .info-b {
          // flex: 1;
          // display: flex;
          // flex-wrap: wrap;
          // padding: 0 20px 10px;

          .device {
            height: 28px;
            // display: flex;
            // justify-content: center;
            // align-items: center;
            line-height: 28px;
            display: inline-block;
            background: #edf5ff;
            border: 1px solid #dbdbdb;
            border-radius: 13px;
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            color: #b7becd;
            letter-spacing: 0.56px;
            padding: 0 15px;
            margin: 5px;
          }
        }
      }

      .meeting-time {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 20px;
        user-select: none;

        .time-box {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          height: 100%;

          .time-item {
            width: calc(100% / 48);
            // height: 78px;
            height: 50%;
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            color: #b7becd;
            letter-spacing: 0.56px;
            display: flex;
            flex-direction: column;

            .hour {
              display: flex;
              justify-content: center;
              align-items: center;
              border-top: 1px solid #dcdcdc;
              border-right: 1px solid #dcdcdc;
              border-bottom: 1px solid #dcdcdc;
              padding: 5px 0;
            }

            &:first-child {
              .hour,
              .minutes {
                border-left: 1px solid #dcdcdc;
              }

              .hour {
                width: 400%;
              }
            }

            &:nth-child(49n) {
              .hour,
              .minutes {
                border-left: 1px solid #dcdcdc;
              }
            }

            &:nth-child(n + 49) {
              > div {
                border-bottom: 1px solid #dcdcdc;
              }
            }

            &:nth-child(2n),
            &:nth-child(3n),
            &:nth-child(7n),
            &:nth-child(11n),
            &:nth-child(19n),
            &:nth-child(23n),
            &:nth-child(31n),
            &:nth-child(43n),
            &:nth-child(47n),
            &:nth-child(59n),
            &:nth-child(67n),
            &:nth-child(71n),
            &:nth-child(79n),
            &:nth-child(83n) {
              .hour {
                // display: none;
                opacity: 0;
                // width: 0;
                // border: none;
              }
            }

            &:nth-child(4n + 1) {
              .hour {
                opacity: 1;
                width: 400%;
              }
            }

            .minutes {
              display: flex;
              flex: 1;
              cursor: pointer;

              > div {
                flex: 1;
                overflow: hidden;
                border-right: 1px solid #dcdcdc;
                cursor: pointer;
                transition: 0.2s;

                &.notSelect {
                  cursor: no-drop;
                  user-select: none;
                  // border-left: none;
                  // border-right: none;
                }
              }
            }
          }
        }
      }
    }
  }

  .repeat-form-tip {
    color: red;
  }

  .pagination {
    display: flex;
    padding-bottom: 15px;
    justify-content: flex-end;
  }
}
</style>
