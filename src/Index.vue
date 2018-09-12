<template>
  <img ref="image" :src="img" v-on="$listeners">
</template>

<script>
import ScrollGet from '@livelybone/scroll-get'
import { SingletonObserver } from './utils'

export default {
  name: 'ImgTag',
  mounted() {
    if (this.lazy) this.subscription = SingletonObserver(this.observerKey).subscribe(this.listener)
    else this.convert(this.src)
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  props: {
    lazy: Boolean,
    defaultImg: String,
    errorImg: String,
    src: [String, FileList, File, Promise],
    observerKey: String,
    preventValue: {
      default: 50,
      type: Number,
    },
  },
  data() {
    return {
      img: this.defaultImg,
      subscription: null,
    }
  },
  computed: {
    canLoad() {
      return !this.lazy || (this.subscription === false)
    },
  },
  watch: {
    src(val) {
      this.convert(val)
    },
  },
  methods: {
    listener() {
      if (this.$refs.image) {
        const { clientLeft, clientTop } = ScrollGet.posRelativeToClient(this.$refs.image)
        const { clientHeight, clientWidth } = document.documentElement
        if (clientLeft - clientHeight < this.preventValue
          || clientTop - clientWidth < this.preventValue) {
          this.convert(this.src)
          this.unsubscribe()
        }
      }
    },
    unsubscribe() {
      if (this.subscription) {
        this.subscription.unsubscribe()
        this.subscription = false
      }
    },
    blobToURL(blob) {
      return {
        url: window.URL.createObjectURL(blob),
        revokeFn: () => window.URL.revokeObjectURL(blob),
      }
    },
    convert(val) {
      if (this.canLoad && val && val.then) {
        // Applicable to images that require verification of login
        val.then((file) => {
          if (file instanceof Blob) this.setImg(this.blobToURL(file))
          else if (typeof file === 'string') this.img = file
          else {
            this.$emit('error', 'The resolved value of prop src(Promise) is invalid')
            this.img = this.errorImg
          }
        })
      } else {
        const value = typeof val === 'string' ? val : val.length && val[0]
        if (!value || typeof value === 'string') {
          this.img = value
        } else if (value instanceof File) {
          this.setImg(this.blobToURL(value))
        } else {
          this.img = this.errorImg
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
