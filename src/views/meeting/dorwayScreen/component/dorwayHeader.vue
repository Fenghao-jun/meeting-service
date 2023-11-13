<template>
  <div class="dorway-header">
    <div class="dorway-header__left"><img :src="logo" class="dorway-header__logo"></div>
    <div class="dorway-header__center">{{ spaceName }}</div>
    <div class="dorway-header__right">
      <p>{{ newTime }}</p>
      <p>{{ dateTime }} {{ weeks }}</p>
    </div>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  name: 'DorwayHeader',
  components: { },
  props: {
    spaceName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      logo: require('@/assets/doorway/logo.png'),
      newTime: moment().format('HH:mm:ss'),
      dateTime: moment().format('MMM Do YY'),
      weeks: moment().format('dddd'),
      timer: null
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.newTime = moment().format('HH:mm:ss')
      this.dateTime = moment().format('MMM Do')
      this.weeks = moment().format('dddd')
    }, 1000)
  },
  deactivated() {
    clearInterval(this.timer)
    this.timer = null
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss">
.dorway-header {
    background: linear-gradient(to right, rgba(50,64,169,0.5),rgba(201,13,190,0.4));
   color: #ffffff;
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 5px 20px;
  &__left {
    img {
        width: 70%;
        z-index: 1;
    }
  }
  &__center {
    font-size: 2rem;
    z-index: 1;
  }
  &__right {
    font-size: 1.4rem;
    text-align: right;
    z-index: 1;
  }
}
</style>
