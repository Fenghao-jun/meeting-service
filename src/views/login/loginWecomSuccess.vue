<script>

export default {
  name: 'LoginWecomSuccess',
  mounted() {
    console.log('跳转中')
    const token = this.$route.query.token
    if (token) {
      this.$store.dispatch('user/setTokenWithWecom', { token, tokenHead: 'Bearer ' }).then(() => {
        this.$router.push({ path: '/' })
      })
    }
  }
}
</script>

<template>
  <div>
    跳转中...
  </div>

</template>

<style scoped lang="scss">

</style>
