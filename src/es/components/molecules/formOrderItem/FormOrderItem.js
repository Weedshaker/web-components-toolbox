// @ts-check

/* global CustomEvent */

import Form from '../form/Form.js'

export default class FormOrderItem extends Form {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.eventListener = event => {
      if (!this.input) return

      if (this.isCheckbox) {
        if (event.currentTarget.checked) {
          this.calcTotal('1', this.priceAttribute, this.priceTotalElement)
        } else {
          this.calcTotal('0', this.priceAttribute, this.priceTotalElement)
        }
      } else {
        const value = this.input?.value ? this.input.value : '0'
        this.updateInputAttributeValue(this.input, value)
        this.calcTotal(value, this.priceAttribute, this.priceTotalElement)
      }
    }

    this.clickListener = () => {
      this.quantityField.value = ''
      this.calcTotal('0', this.priceAttribute, this.priceTotalElement)
    }
  }

  connectedCallback () {
    super.connectedCallback()

    /* event listeners */
    if (this.input) {
      this.input.addEventListener('keyup', this.eventListener)
      this.input.addEventListener('change', this.eventListener)
    }
    if (this.clearQuantityBtn) this.clearQuantityBtn.addEventListener('click', this.clickListener)

    /* set initial attributes */
    this.setPrice(this.priceAttribute, this.priceElement)
    this.calcTotal('0', this.priceAttribute, this.priceTotalElement)

    /* update fixed-price-total on form (sum of all fixed prices) */
    if (this.getAttribute('is-fixed-price')) {
      const currentPrice = parseFloat(this.priceAttribute)
      const parentFormElement = this.closest('m-form')

      if (parentFormElement.getAttribute('fixed-price-total')) {
        let amount = parseFloat(parentFormElement.getAttribute('fixed-price-total'))
        amount += currentPrice
        parentFormElement.setAttribute('fixed-price-total', amount)
      } else {
        parentFormElement.setAttribute('fixed-price-total', currentPrice)
      }
    }
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    if (this.input) {
      this.input.removeEventListener('keyup', this.eventListener)
      this.input.removeEventListener('change', this.eventListener)
    }
    if (this.clearQuantityBtn) this.clearQuantityBtn.removeEventListener('click', this.clickListener)
  }

  /**
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */ `
      :host {
        display:block;
      }
      :host input[type=number] {
        width:var(--a-input-width, auto);
      }
      :host input[type=number]::-webkit-outer-spin-button,
      :host input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      :host input[type=number] {
        -moz-appearance:textfield;
      }
      :host > div {
        align-items: center;
        display:flex;
        flex-direction: row;
        justify-content: space-between;
        padding:var(--padding, 0);
        border-top: 1px solid var(--border-top-color, black);
      }
      :host a-button {
        border: 1px solid transparent; /*default so button wont move when focus border appears*/
        margin-left: 5px;
      }
      :host a-button:focus {
        border: 1px dotted rgb(255, 102, 0);
        border-radius: 0.5em;
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    /** @type {import("../../prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]

    switch (this.getAttribute('namespace')) {
      case 'form-order-item-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false)
      default:
        return this.fetchCSS(styles, false)
    }
  }

  /**
   * Set item price based on attribute value
   * @param {string} priceAttribute
   * @param {HTMLElement} priceElement
   */
  setPrice (priceAttribute, priceElement) {
    if (!priceElement) return
    priceElement.innerText = parseFloat(priceAttribute).toFixed(2)
  }

  /**
   * Calculate total price and display in target element
   * @param {string} value
   * @param {string} price
   * @param {HTMLElement} targetElement
   */
  calcTotal (value, price, targetElement) {
    if (!targetElement) return
    const total = value === '0' ? parseFloat(value).toFixed(2) : (parseFloat(value) * parseFloat(price)).toFixed(2)
    targetElement.innerText = total
    this.setAttribute('total', total)
    this.dispatchEvent(new CustomEvent(this.getAttribute('request-event-name') || 'request-event-name', {
      detail: {
        total,
        name: this.getElementName
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Update attribute 'value'
   * @param {HTMLElement} element
   * @param {string} value
   */
  updateInputAttributeValue (element, value) {
    if (!element) return
    const quantity = value !== '0' ? value : ''
    element.setAttribute('value', quantity)
  }

  get quantityField () {
    return this.root.querySelector('.quantity')
  }

  get priceAttribute () {
    return this.getAttribute('price') || 0
  }

  get priceElement () {
    return this.root.querySelector('.price') || null
  }

  get input () {
    return this.root.querySelector('input') || null
  }

  get isCheckbox () {
    return (this.input != null && this.input.getAttribute('type') === 'checkbox') || null
  }

  get priceTotalElement () {
    return this.root.querySelector('.price-total') || null
  }

  get clearQuantityBtn () {
    return this.root.querySelector('a-button') || null
  }

  get getElementName () {
    return this.getAttribute('name') || ''
  }
}
