<template>
  <div class="statistics">
    <statistics-header :type="type" :statistics-data="statisticsData" @changeType="getStatistics" />
    <div class="statistics__middle">
      <div id="statistics-echart" class="statistics-echart" />
    </div>
    <div class="statistics__footer">
      <statistics-calendar />
    </div>
  </div>
</template>

<script>
import StatisticsHeader from './component/statisticsHeader.vue'
import resize from '@/components/Charts/mixins/resize'
import echarts from 'echarts'
import StatisticsCalendar from './component/statisticsCalendar.vue'
import { queryDataStatistics } from '@/api/statistics'

export default {
  name: 'Statistics',
  components: { StatisticsCalendar, StatisticsHeader },
  mixins: [resize],
  data() {
    return {
      type: 0,
      options: [],
      statisticsData: {
        cumulativeDuration: 0,
        selfInitiatedNum: 0,
        cumulativeNumber: 0,
        beInvitedNum: 0
      }
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.getStatistics(this.type)
    },
    async getStatistics(type) {
      this.type = type
      const { data } = await queryDataStatistics({ type })
      this.statisticsData = { ...data }
      const xAxisData = data.subList.map(item => item.items)
      const durationList = data.subList.map(item => item.duration)
      const numberList = data.subList.map(item => item.number)
      this.chart = echarts.init(document.getElementById('statistics-echart'))
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['时长', '场次'],
          right: '5%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '时长',
            type: 'bar',
            barWidth: '12%',
            data: durationList,
            showBackground: true,
            itemStyle: {
              color: '#2D7ED9'
            },
            backgroundStyle: {
              color: '#2D7ED9'
            }
          }, {
            name: '场次',
            type: 'bar',
            data: numberList,
            barWidth: '12%',
            barGap: '20%',
            itemStyle: {
              color: '#00BEE5'
            },
            showBackground: true,
            backgroundStyle: {
              color: '#00BEE5'
            }
          }
        ]
      })
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
.statistics {
  overflow-y: auto;

  &__middle {
    background: #fff;
    margin-top: 16px;
    height: 523px;
    box-shadow: #ccc 0px 0px 10px 5px;

    .statistics-echart {
      padding: 30px;
      height: 100%;
    }
  }

  &__footer {
    margin: 10px 0;
    box-shadow: #ccc 0 0 5px 5px;
    background: #fff;
    padding: 20px;
  }
}

</style>
