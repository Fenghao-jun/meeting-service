<script>

export default {
  name: 'StatisticsHeaderVue',
  props: {
    type: {
      default: 0,
      type: Number
    },
    statisticsData: {
      default: () => ({}),
      type: Object
    }
  },
  data() {
    return {
      typeList: ['周', '月', '年'],
      queryType: this.type
    }
  },
  computed: {
  },
  methods: {
    changeQueryType(type) {
      console.log(type)
      this.$emit('changeType', type)
    }
  }
}
</script>

<template>
  <div class="statistics-header">
    <div class="statistics-header__left">
      <div class="choose-label">会议预约统计</div>
      <div class="choose-btn">
        <el-radio-group v-model="queryType" @input="changeQueryType">
          <el-radio-button v-for="(item,index) in typeList" :key="index" :label="index">{{ item }}</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="statistics-header__right">
      <div class="statistics-item longtime">
        <div class="statistics-item__desc">
          <span class="statistics-item__desc__label">累计时长</span>
          <span class="statistics-item__desc__value"> {{ statisticsData.cumulativeDuration }}</span>
        </div>
        <img class="statistics-item__img" alt="累计时长" src="@/assets/statistics/time.png">
      </div>
      <div class="statistics-item longnumber">
        <div class="statistics-item__desc">
          <span class="statistics-item__desc__label">累计场数</span>
          <span class="statistics-item__desc__value"> {{ statisticsData.cumulativeNumber }}</span>
        </div>
        <img class="statistics-item__img" alt="累计时长" src="@/assets/statistics/date.png">
      </div>
      <div class="statistics-item initiate">
        <div class="statistics-item__desc">
          <span class="statistics-item__desc__label">我发起的</span>
          <span class="statistics-item__desc__value">{{ statisticsData.selfInitiatedNum }}</span>
        </div>
        <img class="statistics-item__img" alt="累计时长" src="@/assets/statistics/initiate.png">
      </div>
      <div class="statistics-item invite">
        <div class="statistics-item__desc">
          <span class="statistics-item__desc__label">被邀请的</span>
          <span class="statistics-item__desc__value"> {{ statisticsData.beInvitedNum }}</span>
        </div>
        <img class="statistics-item__img" alt="累计时长" src="@/assets/statistics/invite.png">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.statistics-header {
   background: #fff;
   display: flex;
   justify-content: space-between;
   padding: 30px 20px ;
  box-shadow: #ccc 0px 3px 10px 0px;
  &__left {
    flex: 1.5;
    margin-left: 50px;
    .choose-label {
      margin-bottom: 20px;
      color: #666;
    }
  }
  &__right {
    display: flex;
    flex: 2;
    .statistics-item {
      width: 188px;
      height: 90px;
      padding: 20px;
      justify-content: space-between;
      border: 1px solid #eaedf6;
      border-radius: 4px;
      margin-left: 26px;
      display: inline-flex;
      &__desc {
        text-align: center;
        color: #fff;
        &__label {
          display: block;
          margin:5px 0 ;
          font-size: 12px;
        }
        &__value {
          display: block;
          font-size: 20px;
        }
      }
      &__img {
        margin: 10px ;
        height: 30px;
        width: 30px;
      }
    }
    .longtime {
      background: #2D7ED9;
    }
    .longnumber {
      background: #00BEE5;
    }
    .initiate{
      background: #14BC6B;
    }
    .invite {
      background: #FCAB15;
    }
  }
}
</style>
