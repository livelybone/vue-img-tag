<template>
  <img :src="img"
       :alt="alt"
       ref="image"
       :style="defaultStyle"
       v-on="$listeners">
</template>

<script>

export default {
  name: 'ImgTag',
  mounted() {
    this.convert(this.src)
  },
  props: {
    defaultImg: String,
    src: [String, FileList, File, Promise],
    alt: String,
  },
  data() {
    return {
      img: '',
      defaultStyle: { maxWidth: '100%', maxHeight: '100%' }
    }
  },
  watch: {
    src(val) {
      this.convert(val)
    },
  },
  methods: {
    blobToURL(blob) {
      return {
        url: window.URL.createObjectURL(blob),
        revokeFn: () => window.URL.revokeObjectURL(blob),
      }
    },
    convert(val) {
      this.img = this.defaultImg
      if (val && val.then) {
        // Applicable to images that require verification of login
        val.then((file) => {
          if (file instanceof Blob) this.setImg(this.blobToURL(file))
          else if (typeof file === 'string') this.img = file
          else this.$emit('error', 'The resolved value of prop src is invalid')
        })
      } else {
        const value = typeof val === 'string' ? val : val.length && val[0]
        if (!value || typeof value === 'string') {
          this.img = value
        } else if (value instanceof File) {
          this.setImg(this.blobToURL(value))
        }
      }
    },
    setImg(blobUrl) {
      this.img = blobUrl.url
      this.$refs.image.onload = blobUrl.revokeFn
    },
  },
  components: {},
}
</script>
