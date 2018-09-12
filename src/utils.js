import MouseWheel from '@livelybone/mouse-wheel'
import SimpleObserver from '@livelybone/simple-observer'

/**
 * @method SingletonObserver
 * @param {String} key, key of `window`
 * @return {SimpleObserver} with prop unbind<function>
 * */
export function SingletonObserver(key = 'WheelObserver') {
  if (!window[key]) {
    window[key] = new SimpleObserver((next) => {
      this.next = next
    })
    window[key].unbind = MouseWheel.bind(ev => this.next(ev))
  }
  return window[key]
}
