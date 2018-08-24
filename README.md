# vue-img-tag
A simple vue2 component, just for img preview, can be used to file input preview


## repository
https://github.com/livelybone/vue-img-tag.git

## Demo
https://github.com/livelybone/vue-img-tag#readme


## Installation
```bash
npm i -S vue-img-tag
```

## Register
```js
// import all
import ImgTag from 'vue-img-tag';

// Global register
Vue.component('img-tag', ImgTag);

// Local register
new Vue({
  components:{ImgTag}
})
```

## Props
| Name              | Type                                      | DefaultValue         | Description  |
| ----------------- | ----------------------------------------- | -------------------- | ------------ |
| `defaultImg`      | `String`                                  | none                 |  |
| `src`             | `[String, FileList, File, Promise]`       | none                 |  |
| `alt`             | `String`                                  | none                 |  |
