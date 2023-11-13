<template>
  <div class="reservationHeader">
    <el-form :model="form" class="demo-form-inline">
      <div class="ui-from-item">
        <el-form-item label="区域：">
          <el-select
            v-model="form.buildingId"
            placeholder="选择区域"
            clearable
            filterable
            style="width: 200px"
            @change="changeBuildingId"
          >
            <el-option
              v-for="(item, i) in buildList"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="楼宇：">
          <el-select
            v-model="form.floor"
            placeholder="选择楼宇"
            clearable
            style="width: 200px"
            @change="onSubmit('query')"
          >
            <el-option
              v-for="(item, i) in floorList"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="会议室：">
          <el-input v-model="form.spaceName" placeholder="会议室名称" />
        </el-form-item>
        <el-form-item label="设备：">
          <el-select
            v-model="form.machineServiceIdList"
            placeholder="选择设备"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="(item, i) in deviceList"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="容纳人数：">
          <el-select
            v-model="form.capacity"
            placeholder="可容纳人数"
            clearable
            style="width: 200px"
            @change="onSubmit('query')"
          >
            <el-option
              v-for="(item, i) in capacityList"
              :key="i"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间：">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="日期"
            clearable
            style="width: 180px"
            class="mr-2"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            @change="onSubmit('query')"
          />
          <!-- </el-form-item> -->
          <!-- <el-form-item label-width="0px"> -->
          <el-time-select
            v-model="form.startTime"
            class="mr-2"
            placeholder="起始时间"
            :picker-options="{ start: '08:00', step: '00:15', end: '23:45' }"
            clearable
            style="width: 160px"
          />
          <el-time-select
            v-model="form.endTime"
            placeholder="结束时间"
            :picker-options="{ start: '18:00', step: '00:15', end: '23:45' }"
            clearable
            style="width: 160px"
          />
        </el-form-item>
        <!-- <el-row> -->
        <el-form-item>
          <el-button
            v-preventReClick
            type="primary"
            color="#2486EE"
            @click="onSubmit('query')"
          >查询</el-button>
          <!-- <el-button
            v-if="userInfo.txMeetingId"
            type="primary"
            color="#2486EE"
            @click="onSubmit('online')"
          >线上预约</el-button> -->
          <el-dropdown v-preventReClick class="book-meeting-btn" color="#2486EE" split-button type="primary" @command="onSubmit" @click="onSubmit('scheduled')">
            预约会议
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-preventReClick command="showToNext">跨天会议</el-dropdown-item>
              <el-dropdown-item v-preventReClick command="showRepeat">重复会议</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      <!-- </el-row> -->

      </div>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getBuildList, getFloorList } from '@/api/reservation'
export default {
  name: '',
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    deviceList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      floorList: [
      ],
      capacityList: [5, 10, 20, 50],
      buildList: []
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  mounted() {
    this.form.date = this.$moment().format('YYYY-MM-DD')
    this.getBuildList('')
    console.log(this.userInfo)
  },
  methods: {
    onSubmit(type) {
      this.$emit('change', type)
      console.log()
    },
    changeBuildingId(val) {
      if (!val) {
        this.floorList = []
      } else {
        getFloorList(val).then((res) => {
          this.floorList = res.data.map((item, i) => { return { value: item, label: item } })
        })
      }
      this.$emit('change', 'query')
    },
    getBuildList(keyword) {
      keyword = keyword || ''
      getBuildList({ keyword }).then((res) => {
        this.buildList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.reservationHeader {
  padding: 15px 15px 0;
  overflow: hidden;
  .ui-from-item{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .el-form {
    // display: flex;
    // align-items: center;
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      margin-right: 15px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
  }
  ::v-deep .el-form-item__content .mr-2 {
    margin-right: 10px;
  }
  .book-meeting-btn{
     margin-left: 10px;
  }
}
</style>
