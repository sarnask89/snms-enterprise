export default defineAppConfig({
  ui: {
    scrollArea: {
      slots: {
        root: '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
      }
    }
  }
})