<template>
  <img ref="image" :src="img.url||img||defaultImg" v-on="listeners">
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
    defaultImg: String,
    errorImg: String,
    src: [String, FileList, File, Promise],
    observer: {
      default() {
        return defaultConfig
      },
      type: Object,
    },
    preventValue: {
      default: 50,
      type: Number,
    },
  },
  data() {
    return {
      img: '',
      subscription: null,
    }
  },
  computed: {
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
        error: this.onError,
      }
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
        if (val && val.then) {
          /**
           * Applicable to images that require verification of login
           */
          val.then((file) => {
            if (file instanceof Blob) this.img = this.blobToURL(file)
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
            this.img = this.blobToURL(value)
          } else {
            this.img = this.errorImg
          }
        }
      }
    },
    onLoad(ev) {
      if (this.img.revokeFn) {
        this.img.revokeFn()
      }
      this.trigger('load', ev)
    },
    onError(ev) {
      this.img = this.errorImg
      this.trigger('error', ev)
    },
    trigger(name, ev) {
      const event = this.$listeners[name]
      if (event) event(ev)
    },
  },
  components: {},
}
</script>
