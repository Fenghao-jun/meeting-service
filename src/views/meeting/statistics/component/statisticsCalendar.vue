<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { queryMonthDate } from '@/api/statistics'

export default {
  name: 'StatisticsCalendar',
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: 'zh',
        firstDay: 1,
        buttonText: {
          today: '今天'
          // list: "列表",
        },
        headerToolbar: {
          center: 'prevYear prev title next nextYear',
          left: null,
          right: null
        },
        weekNumberCalculation: 'ISO',
        nowIndicator: true,
        height: 650,
        validRange: this.validRange, // 设置可显示的总日期范围
        eventTimeFormat: { // 在每个事件上显示的时间的格式
          hour: 'numeric', // numeric:2022,2-digit:22
          minute: '2-digit',
          meridiem: false,
          hour12: false // 设置时间为24小时
        },
        customButtons: {
          next: {
            click: this.nextClick
          },
          prev: {
            click: this.prevClick
          }
        },
        editable: false, // 允许拖动缩放，不写默认就是false
        overlap: true, // 允许时间重叠，即可以与其他事件并存，不写默认就是false
        // events: [], //背景色 (添加相同时间的背景色时颜色会重叠)
        datesSet: this.datesSet, // 日期渲染；修改日期范围后触发
        eventClick: this.handleEventClick, // 点击日程触发
        dateClick: this.handleDateClick, // 点击日期触发
        eventDrop: this.calendarEventDropOrResize, // 拖动事件触发
        eventResize: this.calendarEventDropOrResize, // 缩放事件触发
        displayEventTime: true, // 不显示具体时间
        displayEventEnd: true,
        events: []
      }
    }
  },
  mounted() {
    this.queryMonthDate()
  },
  methods: {
    momentFormat(val) {
      return this.$moment(val).format('YYYY-MM-DD HH:mm:ss')
    },
    nextClick() {
      this.queryMonthDate()
      this.$refs.fullCalendar.getApi().next() // 将日历向前移动一步（例如，一个月或一周）。
    },
    async queryMonthDate() {
      this.$refs.fullCalendar.getApi()
        .view.calendar.removeAllEventSources()
      const start = this.$moment(this.$refs.fullCalendar.getApi().view.activeStart).format('YYYY-MM-DD')
      console.log(start)
      const end = this.$moment(this.$refs.fullCalendar.getApi().view.activeEnd).format('YYYY-MM-DD')
      const { data } = await queryMonthDate({ start, end })
      const events = data.map(meeting => {
        return {
          id: meeting.id,
          start: this.momentFormat(meeting.startTime),
          end: this.momentFormat(meeting.endTime),
          title: meeting.title
        }
      })
      this.calendarOptions.events = events
      console.log(this.calendarOptions.events)
    },
    prevClick() {
      this.queryMonthDate()
      this.$refs.fullCalendar.getApi().prev() // 将日历后退一步（例如，一个月或一周）。
    },

    getArg(arg) {
      console.log(arg)
    }
  }
}
</script>

<template>
  <full-calendar ref="fullCalendar" :options="calendarOptions">
    <template #eventContent="arg">
      <el-tooltip placement="top" effect="light">
        <div slot="content">【开始时间】: {{ momentFormat(arg.event.start) }}<br>【结束时间】:
          {{ momentFormat(arg.event.end) }}<br>【会议主题】: {{ arg.event.title }}
        </div>
        <div style="text-align:left;" @click="getArg(arg)">
          <i class="el-icon-message-solid" style="color: #3788d8" /> {{ `${arg.timeText} ${arg.event.title}` }}
        </div>
      </el-tooltip>
    </template>
  </full-calendar>
</template>

<style scoped lang="scss">
::v-deep .fc-toolbar-chunk {
  display: flex;

}

::v-deep .fc-button-primary {
  background-color: #fff !important;
  color: #000 !important;
  border: 0 solid #fff !important;
}
</style>
