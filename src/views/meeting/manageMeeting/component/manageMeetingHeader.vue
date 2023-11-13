<template>
  <div class="currentHeader">
    <el-form :model="form" class="demo-form-inline">
      <el-form-item label="时间：">
        <el-date-picker
          v-model="form.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 300px"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input v-model="form.keyword" placeholder="会议主题/参会人/发起人" />
      </el-form-item>
      <el-form-item label="空间：">
        <el-select
          v-model="form.spaceIdList"
          placeholder="空间"
          multiple
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="(item, i) in spaceList"
            :key="i"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select
          v-model="form.statusList"
          placeholder="状态"
          multiple
          clearable
          style="width: 130px"
        >
          <el-option
            v-for="(item, i) in stastusList"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          color="#2486EE"
          @click="onSubmit"
        >查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getManageSpaceList } from '@/api/manageMeeting'

export default {
  name: '',
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      stastusList: [
        {
          label: '未开始',
          value: 0
        },
        {
          label: '进行中',
          value: 1
        },
        {
          label: '已结束',
          value: 2
        }
      ],
      spaceList: []
    }
  },
  mounted() {
    this.getSpaceList()
  },
  methods: {
    onSubmit() {
      this.$emit('query')
      console.log()
    },
    async getSpaceList() {
      const { data } = await getManageSpaceList()
      this.spaceList = data
    }
  }
}
</script>

<style lang="scss" scoped>
.currentHeader {
  padding: 15px 15px 0;
  overflow: hidden;
  .el-form {
    display: flex;
    align-items: center;
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
}
</style>
