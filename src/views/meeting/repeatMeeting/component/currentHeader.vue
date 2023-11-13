<template>
  <div class="currentHeader">
    <el-form :model="form" class="demo-form-inline">
      <el-form-item label="时间：">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 250px"
          value-format="yyyy-MM-dd"
        />
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

    }
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.$emit('query')
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
}
</style>
