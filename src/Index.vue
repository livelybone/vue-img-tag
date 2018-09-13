<template>
  <div v-if="showImg===loadingImg||showImg===errorImg" class="wrap" ref="image"
       :style="showImg===loadingImg&&isColor(showImg)?{background: showImg}:{}">
    <img v-if="showImg===errorImg||!isColor(showImg)" :src="showImg"
         :style="imgStyle" v-on="listeners" ref="imageAlt">
  </div>
  <img v-else ref="image" :src="showImg" v-on="listeners">
</template>

<script>
import * as ScrollGet from '@livelybone/scroll-get'
import { SingletonObserver } from './utils'

const defaultConfig = Object.freeze({
  key: 'WindowScrollObserver',
  eventTarget: typeof window !== 'undefined' ? window : '',
  eventName: 'scroll',
})

export default {
  name: 'ImgTag',
  mounted() {
    if (this.lazy) {
      this.listener()
      if (!this.loadable) {
        this.subscription = SingletonObserver(this.observerConf).subscribe(this.listener)
      }
    } else this.convert(this.src)
  },
  beforeDestroy() {
    this.unsubscribe(true)
  },
  props: {
    lazy: Boolean,
    loadingImg: String,
    errorImg: String,
    src: [String, FileList, File, Promise],
    observer: {
      default() {
        return defaultConfig
      },
      type: Object,
    },
    preventValue: {
      default: 0,
      type: Number,
    },
  },
  data() {
    return {
      img: '',
      imgPre: '',
      imgSize: {},
      subscription: null,
    }
  },
  computed: {
    showImg() {
      return this.img || this.loadingImg
    },
    imgStyle() {
      const { width = 0, height = 0 } = this.imgSize
      return { margin: `-${height / 2}px 0 0 -${width / 2}px` }
    },
    loadable() {
      return !this.lazy || (this.subscription === false)
    },
    observerConf() {
      return { ...defaultConfig, ...this.observer }
    },
    listeners() {
      return {
        ...this.$listeners,
        load: this.onLoad,
      }
    },
  },
  watch: {
    src(val) {
      this.convert(val)
    },
    imgPre() {
      this.imgRequest()
    },
  },
  methods: {
    isColor(val) {
      const reg = [
        /^#([\da-fA-f]{3,4}|[\da-fA-f]{6}|[\da-fA-f]{8})$/,
        /^rgb\((\s*(\d|\d{2}|1\d{2}|2[0-4]\d|25[0-5])\s*,){3}\)$/,
        /^rgba\((\s*(\d|\d{2}|1\d{2}|2[0-4]\d|25[0-5])\s*,){3}\s*\d*.?\d*\)$/,
      ]
      return reg.some(r => r.test(val))
    },
    listener() {
      if (this.$refs.image) {
        const { clientLeft, clientTop } = ScrollGet.posRelativeToClient(this.$refs.image)
        const { clientHeight, clientWidth } = document.documentElement
        if (clientLeft - clientWidth < this.preventValue
          && clientTop - clientHeight < this.preventValue) {
          this.unsubscribe()
          this.convert(this.src, true)
        }
      }
    },
    unsubscribe(isEnd = false) {
      if (this.subscription) {
        this.subscription.unsubscribe()
      }
      this.subscription = false

      if (isEnd) {
        /**
         * Destroy observer singleton if it have no subscribe
         * Then remove event listener of eventTarget
         * */
        const singleton = window[this.observerConf.key]
        if (singleton && singleton.subscribes.length < 1) {
          singleton.unbind()
          window[this.observerConf.key] = null
        }
      }
    },
    blobToURL(blob) {
      return {
        url: window.URL.createObjectURL(blob),
        revokeFn: () => window.URL.revokeObjectURL(blob),
      }
    },
    convert(val, force = false) {
      if (force || this.loadable) {
        this.img = ''
        if (val && val.then) {
          /**
           * Applicable to images that require verification of login
           */
          val.then((file) => {
            if (file instanceof Blob) this.imgPre = this.blobToURL(file)
            else if (typeof file === 'string') this.imgPre = file
            else {
              this.$emit('error', 'The resolved value of prop src(Promise) is invalid')
              this.imgPre = this.errorImg
            }
          })
        } else {
          const value = typeof val === 'string' || !val ? val : val.length && val[0] || val
          if (!value || typeof value === 'string') {
            this.imgPre = value
          } else if (value instanceof File) {
            this.imgPre = this.blobToURL(value)
          } else {
            this.imgPre = this.errorImg
          }
        }
      }
    },
    imgRequest() {
      if (this.imgPre) {
        const url = this.imgPre.url || this.imgPre
        const img = document.createElement('img')
        img.src = url
        img.style.display = 'none'
        img.onload = () => {
          this.img = url
          if (this.imgPre.revokeFn) {
            this.imgPre.revokeFn()
          }
          document.body.removeChild(img)
        }
        img.onerror = () => {
          this.img = this.errorImg
        }
        document.body.appendChild(img)
      }
    },
    onLoad(ev) {
      if (this.$refs.imageAlt) {
        this.imgSize = {
          width: this.$refs.imageAlt.offsetWidth,
          height: this.$refs.imageAlt.offsetHeight,
        }
      }
      const event = this.$listeners.load
      if (event) event(ev)
    },
  },
  components: {},
}
</script>
