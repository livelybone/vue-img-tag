<template>
  <div v-if="showImg===loadingImg||showImg===errorImg"
       class="wrap" ref="image"
       :style="wrapStyle">
    <img v-if="showExceptionImg"
         :src="showImg"
         :style="imgStyle"
         v-on="listeners"
         ref="imageAlt">
  </div>
  <img v-else ref="image"
       :src="showImg"
       v-on="listeners">
</template>

<script>
import * as ScrollGet from '@livelybone/scroll-get'
import { blobToBase64 } from 'base64-blob'

const defaultConfig = Object.freeze({
  eventTarget: typeof window !== 'undefined' ? window : '',
  eventName: 'scroll',
})

const { FileList, File, Promise } = typeof window === 'undefined'
  ? { FileList: Object, File: Object, Promise: Object } : window

export default {
  name: 'ImgTag',
  props: {
    lazy: Boolean,
    loadingImg: String,
    errorImg: String,
    src: [String, FileList, File, Promise],
    event: {
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
      loaded: false,
    }
  },
  computed: {
    showImg() {
      return this.img || this.loadingImg
    },
    imgStyle() {
      const defaultS = {
        position: 'absolute',
        left: '50%',
        top: '50%',
      }
      const { width = 0, height = 0 } = this.imgSize
      return { ...defaultS, margin: `-${height / 2}px 0 0 -${width / 2}px` }
    },
    loadable() {
      return !this.lazy || (this.loaded === true)
    },
    eventConf() {
      return { ...defaultConfig, ...this.event }
    },
    listeners() {
      return {
        ...this.$listeners,
        load: this.onLoad,
      }
    },
    showExceptionImg() {
      return this.showImg === this.errorImg || !this.isColor(this.showImg)
    },
    wrapStyle() {
      const defaultS = {
        display: 'inline-block',
        position: 'relative',
        overflow: 'hidden',
      }
      return this.showExceptionImg ? defaultS : { ...defaultS, background: this.showImg }
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
          this.unbind()
          this.convert(this.src, true)
        }
      }
    },
    unbind() {
      this.eventConf.eventTarget.removeEventListener(this.eventConf.eventName, this.listener)
      this.loaded = true
    },
    convert(val, force = false) {
      if (force || this.loadable) {
        this.img = ''
        if (val && val.then) {
          /**
           * Applicable to images that require verification of login
           */
          val.then((file) => {
            if (file instanceof Blob) {
              blobToBase64(file).then((url) => {
                this.setImgPre(url)
              }).catch(console.error)
            } else if (typeof file === 'string') {
              this.setImgPre(file)
            } else {
              this.$emit('error', 'The resolved value of prop src(Promise) is invalid')
              this.setImgPre(this.errorImg)
            }
          })
        } else {
          const value = typeof val === 'string' || !val ? val : val.length && val[0] || val
          if (!value || typeof value === 'string') {
            this.setImgPre(value)
          } else if (value instanceof File) {
            blobToBase64(value).then((url) => {
              this.setImgPre(url)
            }).catch(console.error)
          } else {
            this.setImgPre(this.errorImg)
          }
        }
      }
    },
    setImgPre(val) {
      if (this.imgPre === val) {
        this.img = val
      } else {
        this.imgPre = val
      }
    },
    imgRequest() {
      if (this.imgPre) {
        const img = document.createElement('img')
        img.onload = () => {
          this.img = this.imgPre
        }
        img.onerror = () => {
          this.img = this.errorImg
        }
        img.src = this.imgPre
        if (img.complete) this.img = this.imgPre
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
  mounted() {
    if (this.lazy) {
      this.listener()
      if (!this.loadable) {
        this.eventConf.eventTarget.addEventListener(this.eventConf.eventName, this.listener)
      }
    } else this.convert(this.src)
  },
  beforeDestroy() {
    this.unbind()
  },
}
</script>
