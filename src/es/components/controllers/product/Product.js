// @ts-check
/* global fetch */
/* global AbortController */
/* global CustomEvent */
/* global self */

import { Shadow } from '../../prototypes/Shadow.js'

/**
 * @export
 * @class Product
 * @type {CustomElementConstructor}
 */
export default class Product extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    this.abortController = null
    this.requestListProductListener = this.requestListProductListenerEvent
    this.updatePopState = this.updatePopStateEvent
  }

  connectedCallback () {
    // @ts-ignore
    if (!this.hasAttribute('no-popstate')) self.addEventListener('popstate', this.updatePopState)
    this.addEventListener(this.getAttribute('request-list-product') || 'request-list-product', this.requestListProductListener)
  }

  disconnectedCallback () {
    // @ts-ignore
    if (!this.hasAttribute('no-popstate')) self.removeEventListener('popstate', this.updatePopState)
    this.removeEventListener(this.getAttribute('request-list-product') || 'request-list-products', this.requestListProductListener)
  }

  /**
   * Fetch products
   * @param {{ detail: any; }} event
   */
  async requestListProductListenerEvent (event) {
    console.log('PRODUCTS', event.detail)
    if (this.abortController) this.abortController.abort()
    this.abortController = new AbortController()
    const fetchOptions = {
      method: 'GET',
      signal: this.abortController.signal
    }
    const limit = 100
    const categoryCode = this.getCategoryCode()
    const minPercentage = event?.detail?.this.getAttribute('min-percentage') || 0
    this.showSubCategories(this.subCategoryList, categoryCode)
    const endpoint = this.getAttribute('endpoint') + `?categoryCode=${categoryCode}&limit=${limit}&min_percentage=${minPercentage}`
    this.dispatchEvent(new CustomEvent(this.getAttribute('list-product') || 'list-product', {
      detail: {
        fetch: (this._fetch || (this._fetch = fetch(endpoint, fetchOptions))).then(response => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json()
          }
          throw new Error(response.statusText)
        })
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Update pop state when navigating back/forward
   * @param {{ detail: { pushHistory: boolean; }; state: any; }} event
   */
  updatePopStateEvent (event) {
    console.log('UPDATE_POP_STATE:', event)
    if (!event.detail) event.detail = { ...event.state }
    event.detail.pushHistory = false
    this.requestListProductListener(event)
  }
}
