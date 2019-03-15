# vue-img-tag
[![NPM Version](http://img.shields.io/npm/v/vue-img-tag.svg?style=flat-square)](https://www.npmjs.com/package/vue-img-tag)
[![Download Month](http://img.shields.io/npm/dm/vue-img-tag.svg?style=flat-square)](https://www.npmjs.com/package/vue-img-tag)
![gzip with dependencies: 2.2kb](https://img.shields.io/badge/gzip--with--dependencies-2.2kb-brightgreen.svg "gzip with dependencies: 2.2kb")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")
![lazyload supported](https://img.shields.io/badge/lazyload-supported-green.svg "lazyload supported")
![ssr supported](https://img.shields.io/badge/ssr-supported-green.svg "ssr supported")

> `pkg.module supported`, which means that you can apply tree-shaking in you project

A simple vue2 component, just for img preview, can be used to image input preview

## repository
https://github.com/livelybone/vue-img-tag.git

## Demo
https://livelybone.github.io/vue/vue-img-tag/

## Example
See: [example](https://github.com/livelybone/vue-img-tag/blob/master/examples/test.html)

## Installation
```bash
npm i -S vue-img-tag
```

## Global name
`VueImgTag`

## Usage
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
| `lazy`            | `Boolean`                                 | `false`              | Enable lazy mode or not |
| `loadingImg`      | `String`                                  | none                 | Can be `url` or `color`(should be rgb, rgba or hex)  |
| `errorImg`        | `String`                                  | none                 | Don't set to `color`, only `url` allowed |
| `src`             | `[String, FileList, File, Promise]`       | none                 |  |
| `preventValue`    | `Number`                                  | `0`                  | The boundary condition |
| `event`           | `Object`                                  | `defaultConf`        | Config of event which is use to judge whether img should load or not, especially useful when lazy mode is enabled |

```js
const defaultConf = {
  eventName: 'scroll', // The event listened to
  eventTarget: window, // what dom do event triggered on
}
```
