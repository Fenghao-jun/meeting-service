<template>
  <div class="dorwayScreen">
    <dorway-header :space-name="space.name" />
    <div class="dorwayScreen__content">
      <el-row :gutter="20">
        <el-col :span="7">
          <div class="ui-content-left">
            <div class="ui-content-left-img"><el-image :src="space.coverPicture" fit="cover" /></div>
            <p>{{ nowMeeting?nowMeeting.title:'' }}</p>
            <p>会议类型：{{ meetingType }}</p>
            <p>会议时间：{{ nowMeeting? `${$moment(nowMeeting.startTime).format('HH:mm')}~${$moment(nowMeeting.endTime).format('HH:mm')}` :'' }}</p>
            <div class="ui-content-left-btn">
              <el-button :type="meetingStatus==='进行中'?'danger':meetingStatus=== '等待中'?'warning':'success'">
                {{ meetingStatus || '空闲中' }}
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="17">
          <div class="ui-content-right">
            <el-table :data="tableData" fit max-height="350">
              <el-table-column property="time" label="会议时间" width="400">
                <template slot-scope="{ row }">
                  {{ row | filterMeetingTime }}
                </template>
              </el-table-column>
              <el-table-column property="createUserName" label="预订人" />
              <el-table-column property="statusText" label="会议状态">
                <template slot-scope="{ row }">
                  <span :class="row.status===1?'ui-red':row.status===0?'ui-orange':'ui-success'" />&nbsp;{{ row.statusText }}
                </template>
              </el-table-column>
            </el-table>

          </div>
        </el-col>
      </el-row>
    </div>
    <div class="dorwayScreen__bottom">
      信誉至上，用户第一，质量满意，交货准时，满足顾客对产品质量的期望和要求
    </div>
  </div>
</template>

<script>
import dorwayHeader from './component/dorwayHeader.vue'
import { getDoorMeeting } from '@/api/reservation'
import { MeetingTypeList } from '@/utils/constants'
import moment from 'moment'
// import resize from '@/components/Charts/mixins/resize'
// import echarts from 'echarts'
// import StatisticsCalendar from './component/statisticsCalendar.vue'

export default {
  name: 'DorwayScreen',
  components: { dorwayHeader },
  filters: {
    filterMeetingTime(row) {
      const today = moment().startOf('day')
      const start = moment(row.startTime)
      const end = moment(row.endTime)
      if (moment(start).isSame(today, 'd') && moment(end).isSame(today, 'd')) {
        return `${start.format('HH:mm')} ~ ${end.format('HH:mm')}`
      } // today
      return `${start.format('YYYY-MM-DD HH:mm')} ~ ${end.format('YYYY-MM-DD HH:mm')}`
    }
  },
  // mixins: [resize],
  data() {
    return {
      nowMeeting: {
      },
      errorImg: require('@/assets/doorway/room.png'),
      tableData: [
      ],
      space: {}
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    meetingStatus() {
      if (!this.nowMeeting) {
        return
      }
      if (!this.tableData) {
        return '空闲中'
      }
      if (this.nowMeeting.status === 0) {
        return '等待中'
      }
      if (this.nowMeeting.status === 1) {
        return '进行中'
      }
    },
    // eslint-disable-next-line vue/return-in-computed-property
    meetingType() {
      if (!this.nowMeeting) {
        return
      }
      return MeetingTypeList.filter(item => item.value === this.nowMeeting.type)[0]?.label
    }
  },
  mounted() {
    this.getDoorMeetingInfo()
    window.setInterval(() => {
      this.getDoorMeetingInfo()
    }, 1000 * 5)
  },
  methods: {
    hanldeCancel() {
      this.$confirm('确认要取消会议吗？', '提示', {
        type: 'warning',
        center: true
      }).then(() => {

      }).catch(() => {})
    },
    async getDoorMeetingInfo() {
      const sid = this.$route.query.sid
      if (!sid) {
        return
      }
      const { data, code } = await getDoorMeeting(sid)
      if (code === 200) {
        console.log(data)
        this.tableData = data.meetingList
        this.nowMeeting = data.currentMeetingVo
        this.space = data.space
      }
    }
  }
}
</script>
<style lang="scss">
.app-main {
overflow: auto !important;
}
</style>
<style lang="scss" scoped>
.dorwayScreen {
  user-select:none;
    overflow-y: auto;
    min-height: 100%;
    width: 100%;
    min-width: 520px;
    // background-color: $bg;
    --bg: url(~@/assets/doorway/bg.png);
    background: var(--bg) no-repeat;
    background-size: 100vw 100vh;
    overflow: hidden;
    position: relative;
    &__bottom {
        // background: rgba($color: #ada4da, $alpha: 0.5);
        background: linear-gradient(to right, rgba(50,64,169,0.5),rgba(201,13,190,0.4));
        padding: 20px 0;
        text-align: center;
        position: absolute;
        bottom: 0;
        width: 100%;
        font-size: 1.4rem;
        color: #ffffff;
    }
    .dorwayScreen__content{
        padding: 1% 0.5%;
        position: absolute;
        width: 100%;
        height: 75%;
        .el-row{
            width: 100%;
            height: 100%;
            margin: 0 !important;
            .el-col{
                height: 100%;
            }
        }
        .ui-content-left{
            background: rgba($color: #181b48, $alpha: 0.6);
            height: 100%;
            border-radius: 10px;
            padding: 3%;
            position: relative;
            &-img{
                height: 40%;
                margin: 0 auto;
                overflow: hidden;
                img{
                    width: 100%;
                }
            }
            p{
                color: #ffffff;
                font-size: 1.4rem;
            }
            &-btn{
                position: absolute;
                width: 94%;
                bottom: 6%;
                text-align: center;
                .el-button{
                    width: 70%;
                }
            }
        }
        .ui-content-right{
            background: rgba($color: #181b48, $alpha: 0.6);
            height: 100%;
            border-radius: 10px;
            padding: 2%;
            ::v-deep .el-table{
                background: none !important;
            }
            ::v-deep .el-table tr{
                background: none !important;
                color: #ffffff;
                font-size: 1.4rem !important;
            }
            ::v-deep .el-table thead tr{
                // font-size: 16px;
                // font-size: 0.9rem !important;
            }
            ::v-deep .el-table th{
                background: none !important;
            }
            ::v-deep .el-table th.is-leaf, .el-table td{
                border: none !important;
            }
            ::v-deep .el-table::before{
                height: 0 !important;
            }
            ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td{
                background: #3243E4 !important;
            }
            ::v-deep .el-table .el-table__row td{
                border: none !important;
            }
            .ui-red{
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: red;
            }
            .ui-orange{
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: orange;
            }
            .ui-success{
                display: inline-block;
                width: 0.8rem;
                height: 0.8rem;
                border-radius: 50%;
                background: greenyellow;
            }
            &-btn{
                margin-top: 4%;
                padding-right: 2%;
                text-align: right;
            }
        }
    }

}
.dorwayScreen::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(~@/assets/doorway/bg2.png);
}
::v-deep .el-button{
  font-size: 1.4rem;
}

</style>
