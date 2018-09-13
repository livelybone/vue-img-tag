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
| `errorImg`        | `String`                                  | none                 |  |
| `src`             | `[String, FileList, File, Promise]`       | none                 |  |
| `preventValue`    | `Number`                                  | `0`                  | The boundary condition |
| `observer`        | `Object`                                  | `defaultConf`        | Config of singleton observer which is use to judge whether img should load or not, especially useful when lazy mode is enabled |

```js
const defaultConf = {
  key: 'windowScrollObserver', // key of context `window`, the singleton observer will be window[key]
  eventName: 'scroll', // the event triggered on `eventTarget` will push an event to the subscribers of singleton observer, so that we can judge whether img should load or not
  eventTarget: window, // what dom do event triggered on
}
```

## singletonObserver
> This is an instance of [Observer](https://github.com/livelybone/simple-observer/blob/master/src/index.js),
> with an extra prop of `unbind` function which is used to remove `eventName` listener of `eventTarget`

> If the `observer.key` like the default `windowScrollObserver` you set for the `VueImgTag` instances used in your page is the same, all the instances will share one singletonObserver. 

> The instance is mounted on the `window` object, so, your can use it out of the component via `window[observer.key]`
> or you can even define it out of the component via `window[observer.key]`(your should make sure that it is an instance of Observer, with an `unbind` function)

## Style
For building style, you can use the css file in lib directory.
```js
import '@livelybone/vue-img-tag/lib/css/index.css';
```

Or, you can build your custom style by copying and editing `index.css`

