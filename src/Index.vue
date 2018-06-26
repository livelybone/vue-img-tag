<template>
  <img :src="img"
       :alt="alt"
       ref="image"
       :style="defaultStyle"
       @load="$emit('load',$event.target)"
       @click.stop="$emit('click',$event)"
       @dragstart="$emit('dragStart',$event)"
       @dragend="$emit('dragEnd',$event)">
</template>

<script>

export default {
  name: 'ImgTag',
  mounted() {
    this.convert(this.src);
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
    };
  },
  watch: {
    src(val) {
      this.convert(val);
    },
  },
  methods: {
    blobToURL(blob) {
      return {
        url: window.URL.createObjectURL(blob),
        revokeFn: () => window.URL.revokeObjectURL(blob),
      };
    },
    convert(val) {
      this.img = this.defaultImg;
      if (!val || typeof val === 'string') {
        this.img = val;
      } else if (val instanceof FileList && val[0]) {
        this.setImg(this.blobToURL(val[0]));
      } else if (val instanceof File) {
        this.setImg(this.blobToURL(val));
      } else if (val instanceof Promise) {
        // Applicable to images that require verification of login
        val.then((file) => {
          if (file instanceof Blob) this.setImg(this.blobToURL(file));
          else if (typeof file === 'string') this.img = file;
          else this.$emit('error', 'The resolved value of prop src is invalid');
        });
      }
    },
    setImg(blobUrl) {
      this.img = blobUrl.url;
      this.$refs.image.onload = blobUrl.revokeFn;
    },
  },
  components: {},
};
</script>
