# vue-img-tag
![gzip with dependencies: 5.7kb](https://img.shields.io/badge/gzip--with--dependencies-5.7kb-brightgreen.svg "gzip with dependencies: 5.7kb")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")
![lazyload supported](https://img.shields.io/badge/lazyload-supported-green.svg "lazyload supported")

> `pkg.module supported`, which means that you can apply tree-shaking in you project

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
import VueImgTag from 'vue-img-tag';

// Global register
Vue.component('img-tag', VueImgTag);

// Local register
new Vue({
  components:{VueImgTag}
})
```

## Props
| Name              | Type                                      | DefaultValue         | Description  |
| ----------------- | ----------------------------------------- | -------------------- | ------------ |
| `defaultImg`      | `String`                                  | none                 |  |
| `src`             | `[String, FileList, File, Promise]`       | none                 |  |
| `alt`             | `String`                                  | none                 |  |
