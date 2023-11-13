<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, img } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else if (icon.includes('img-')) {
        vnodes.push(
          <img
            src={require(`@/assets/layout/${icon}.png`)}
            class='layout-img'
          />
        )
      } else {
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }
    if (img) {
      console.log('?????')
    }

    if (title) {
      vnodes.push(<span slot='title'>{title}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
.layout-img {
  width: 1em;
  margin-right: 16px;
}
</style>
