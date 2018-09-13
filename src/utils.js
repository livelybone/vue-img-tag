import * as SimpleObserver from '@livelybone/simple-observer'

/**
 * @method SingletonObserver
 * @param {String} key, key of `window`
 * @param {Window, Element} eventTarget, target of event
 * @param {String} eventName, name of event
 * @return {SimpleObserver} with prop unbind<function>
 * */
export function SingletonObserver({ key = 'WindowScrollObserver', eventTarget = window, eventName = 'scroll' }) {
  let next
  if (!window[key] || !(window[key] instanceof SimpleObserver.Observer)) {
    window[key] = new SimpleObserver.Observer((n) => {
      next = n
    })
    eventTarget.addEventListener(eventName, next)
    window[key].unbind = () => eventTarget.removeEventListener(eventName, next)
  }
  return window[key]
}
