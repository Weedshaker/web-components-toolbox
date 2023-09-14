// @ts-check
import { Shadow } from '../../prototypes/Shadow.js'

/* global CustomEvent */

export default class BasketControl extends Shadow() {
  /**
   * @param options
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.currentProductId = this.quantityField?.getAttribute('id') || 0

    this.answerEventNameListener = event => {
      event.detail.fetch.then(productData => {
        const { orderItems } = productData.response
        const currentProduct = orderItems.find((/** @type {{ mapiProductId: any; }} */ item) => {
          return item.mapiProductId === event.detail.id && item.mapiProductId === this.currentProductId
        })
        if (currentProduct) {
          this.setVisibilityAndValue(currentProduct.amount, this.quantityField)
        }
      }).catch(error => {
        this.html = ''
        this.html = `${error}`
      })
    }

    this.clickListener = event => {
      event.preventDefault()
      event.stopPropagation()
    }

    this.inputListener = event => {
      const inputValue = Number(event.target.value)
      if (!inputValue || isNaN(inputValue)) return
      this.dispatchEvent(new CustomEvent(this.quantityField.getAttribute('request-event-name') || 'request-event-name',
        {
          detail: {
            amount: Number(event.target.value),
            id: event.target.getAttribute('tag')
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }
      ))
    }
  }

  connectedCallback () {
    document.body.addEventListener(this.getAttribute('answer-event-name') || 'answer-event-name', this.answerEventNameListener)
    if (this.shouldRenderCSS()) this.renderCSS()
    this.quantityField?.addEventListener('click', this.clickListener)
    this.quantityField?.addEventListener('input', this.inputListener)
    this.setVisibilityAndValue(this.quantityField?.value, this.quantityField)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('answer-event-name') || 'answer-event-name', this.answerEventNameListener)
    this.quantityField?.removeEventListener('click', this.clickListener)
    this.quantityField?.removeEventListener('input', this.inputListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */ `
    :host {
        display:flex;
        width:100%;
        justify-content:flex-start;
        align-items: center;
        animation: var(--show, show .3s ease-out);
        container: productList / inline-size;
      }

      @container productList (max-width: 150px) {
        a-button::part(button){
          padding: 0;
          height: 1.2em;
          width: 1.2em;
        }

        a-button::part(label){
          padding: 0;
          margin-top: -3px;
        }

        :host .basket-control-input {
          height: 1.6em;
          font-size: 0.8em;
        }
      }

      @container productList (max-width: 110px) {
        a-button#remove::part(button) {
          margin-left:-0.85em;
        }

        a-button#add::part(button) {
          margin-right:-0.85em;
        }

        :host .basket-control-input {
          padding:0;
          margin: 0 3px;
        }
      }



      :host(.default) {
        justify-content:space-between;
      }

      :host(.closed) input, :host(.closed) #remove {
        display:none;
      }

      :host(.closed.default) {
        justify-content:flex-end;
      }

      :host input {
        background-color: var(--quantity-background-color, transparent);
        border-radius: var(--quantity-border-radius, 0.5em);
        border: 1px solid var(--quantity-border-color, red);
        font-family: var(--quantity-font-family, inherit);
        font-size: var(--quantity-font-size, inherit);
        height:var(--quantity-height, auto);
        margin: var(--quantity-margin, 0 0.5em);
        padding: var(--quantity-margin, 0.5em);
        text-align:var(--quantity-text-align, center);
        width: var(--quantity-margin, 4em);
      }
      /* https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp */
      input[type=number] {
        appearance: textfield;
      }
      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      input[type=number] {
        -moz-appearance: textfield;
      }

      @keyframes show {
          0%{opacity: 0}
          100%{opacity: 1}
        }

      @media only screen and (max-width: _max-width_) {}
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
        namespaceFallback: false
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'basket-control-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      case 'basket-control-product-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./product-/product-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  setVisibilityAndValue (value, inputField) {
    inputField.value = value
    if (value === '0') {
      this.classList.add('closed')
    } else {
      this.classList.remove('closed')
    }
  }

  get quantityField () {
    return this.root.querySelector('input')
  }

}
