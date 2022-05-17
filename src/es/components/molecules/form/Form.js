// @ts-check
import { Shadow } from '../../prototypes/Shadow.js'
import Button from '../../atoms/button/Button.js'

/* global customElements */
/* global self */
/* global fetch */

/**
 * As a molecule, this component shall hold Atoms
 * Umbraco Forms Styling
 * Figma Example: https://www.figma.com/file/npi1QoTULLWLTGM4kMPUtZ/Components-Universal?node-id=1904%3A17142
 * 
 *
 * @export
 * @class Wrapper
 * @type {CustomElementConstructor}
 * @attribute {
 *
 * }
 * @return {CustomElementConstructor | *}
 */
export default class Form extends Shadow() {
  constructor (options = {}, ...args) {
    super(Object.assign(options, { mode: 'false' }), ...args)

    this.setAttribute('role', 'form')
    // scroll to first error
    this.clickListener = event => {
      setTimeout(() => {
        let fieldValidationError
        if ((fieldValidationError = this.root.querySelector('.field-validation-error')) && fieldValidationError.parentNode && fieldValidationError.parentNode.parentNode) fieldValidationError.parentNode.parentNode.scrollIntoView()
      }, 50)
    }

    this.submitListener = event => {
      event.preventDefault()

      if (this.getAttribute('site-key') && this.getAttribute('controller-name')) {
        this.loadDependency().then(grecaptcha => {
          // @ts-ignore
          grecaptcha.ready(() => {
            // @ts-ignore
            grecaptcha.execute(this.getAttribute('site-key'), { action: 'submit_form' }).then(token => {
              fetch(`/umbraco/api/${this.getAttribute('controller-name')}/VerifyRecaptcha`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recaptchaToken: token })
              })
                .then(response => {
                  if (response.ok) return response.json()
                })
                .then(response => {
                  if (response) { // passed captcha
                    console.info('TESTING: passed captcha')
                  } else {
                    console.error('Failed captcha')
                    // TODO stop form from sending
                  }
                })
              // TODO stop form from sending
                .catch(error => console.error('Something went wrong while verifying captcha: ', error))
            })
          })
        })
      }
    }
  }

  connectedCallback () {
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.submit) this.submit.addEventListener('click', this.clickListener)
    if (this.hasAttribute('use-recaptcha') !== null) this.addEventListener('submit', this.submitListener)
  }

  disconnectedCallback () {
    if (this.submit) this.submit.removeEventListener('click', this.clickListener)
    if (this.hasAttribute('use-recaptcha') !== null) this.removeEventListener('submit', this.submitListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the css
   *
   * @return {void}
   */
  renderCSS () {
    // @ts-ignore
    if (!customElements.get('a-button')) customElements.define('a-button', Button)
    const button = new Button({ namespace: 'button-primary-' })
    button.hidden = true
    this.html = button
    button.renderCSS().then(styles => styles.forEach(style => (this.html = style.styleNode)))
    this.css = button.css.replace(/\sbutton/g, ' input[type=submit]').replace(/\s#label/g, ' input[type=submit]')
    button.remove()
    this.css = /* css */`
      :host {
        width:100%;
      }
      legend {
        font-family: var(--font-family-bold, var(--font-family, inherit));
      }
      input, textarea {
        caret-color: var(--color-secondary);
      }
      textarea {
        resize: none;
      }
      input[type]:disabled{
        background-color:red;
      }
      ${this.getInputFieldsWithText()}, ${this.getInputFieldsWithControl()} {
        border-radius: var(--border-radius, 0.5em);
        background-color: transparent;
        box-sizing: border-box;
        border: 1px solid var(--m-gray-400);
        color: var(--color);
        padding: 0.625em;
        font-size: var(--font-size);
        outline: none;
        width: 100%;
      }
      ${this.getInputFieldsWithText('::placeholder')} {
        color: var(--m-gray-600);
        opacity: 1;
      }
      ${this.getInputFieldsWithText(':hover')} {
        border-color: var(--m-gray-600);
      }
      ${this.getInputFieldsWithText(':focus')} {
        border-color: var(--color-secondary);
      }
      .umbraco-forms-indicator {
        color: var(--color-secondary);
      }
      .umbraco-forms-field {
        padding-bottom: var(--content-spacing);
      }
      .field-validation-error {
        color: var(--color-secondary);
        padding: 0 0.625em;
        font-size: 0.875em;
      }
      fieldset {
        border: 0;
        margin: 0;
        padding: 0;
      }
      .help-block {
        font-style: italic;
      }
      .checkbox > label, .checkboxlist > label, .radiobutton > label, .radiobuttonlist > label {
        vertical-align: super;
      }
      .checkbox > label, .checkbox > .help-block, .checkboxlist > label, .checkboxlist > .help-block, .radiobutton > label, .radiobutton > .help-block, .radiobuttonlist > label, .radiobuttonlist > .help-block {
        padding-left: var(--content-spacing);
      }
      ${this.getInputFieldsWithControl()} {
        height: 1.5em;
        width: 1.5em;
      }
      *.steps__title {
        color: var(--background-color) !important;
        background-color: var(--color-secondary) !important;
        padding: 0.625em !important;
      }
      .checkboxlist {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
      }
      .checkboxlist img {
        padding: 0 var(--content-spacing);
        max-width: 30vw !important;
      }
      @media only screen and (max-width: _max-width_) {
        :host {
          width: 100% !important;
        }
        ${this.getInputFieldsWithText()} {
          font-size: var(--font-size-mobile);
        }
        ${this.getInputFieldsWithText()}, ${this.getInputFieldsWithControl()} {
          border-radius: var(--border-radius-mobile, var(--border-radius, 0.571em));
        }
      }
      /* loader */
      .loader {
        position: relative;
        height: 20px;
        width: 20px;
        display: inline-block;
        animation: around 5.4s infinite;
      }
      
      @keyframes around {
        0% {
          transform: rotate(0deg)
        }
        100% {
          transform: rotate(360deg)
        }
      }
      
      .loader::after, .loader::before {
        content: "";
        background: white;
        position: absolute;
        display: inline-block;
        width: 100%;
        height: 100%;
        border-width: 2px;
        border-color: #333 #333 transparent transparent;
        border-style: solid;
        border-radius: 20px;
        box-sizing: border-box;
        top: 0;
        left: 0;
        animation: around 0.7s ease-in-out infinite;
      }
      
      .loader::after {
        animation: around 0.7s ease-in-out 0.1s infinite;
        background: transparent;
      }
      .suggestion{
        background-color:#ccc;
      }
      .suggestion ul {
        display: none;
        list-style-type: none;
        padding: 0;
        margin: 0;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,.2);
        max-height: 200px;
        overflow-y: auto;
      }
        
      .suggestion ul li {
        padding: 10px;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.2);
      }

      .suggestion ul li:hover {
        background-color: orange;
      }
       
    `
    /** @type {import("../../prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${import.meta.url.replace(/(.*\/)(.*)$/, '$1')}../../../../css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${import.meta.url.replace(/(.*\/)(.*)$/, '$1')}../../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      default:
        return this.fetchCSS(styles, false)
    }
  }

  /**
   * fetch dependency
   *
   * @returns {Promise<{components: any}>}
   */
  loadDependency () {
    return this.dependencyPromise || (this.dependencyPromise = new Promise(resolve => {
      // needs markdown
      if ('grecaptcha' in self === true) {
        resolve(self.grecaptcha) // eslint-disable-line
      } else {
        const vendorsMainScript = document.createElement('script')
        vendorsMainScript.setAttribute('type', 'text/javascript')
        vendorsMainScript.setAttribute('async', '')
        vendorsMainScript.setAttribute('src', `https://www.google.com/recaptcha/api.js?render=${this.getAttribute('site-key')}`)
        vendorsMainScript.onload = () => {
          if ('grecaptcha' in self === true) resolve(self.grecaptcha) // eslint-disable-line
        }
        this.html = [vendorsMainScript]
      }
    }))
  }

  getInputFieldsWithText (add) {
    return [
      'input[type=text]',
      'input[type=password]',
      'input[type=tel]',
      'input[type=email]',
      'input[type=number]',
      'input[type=search]',
      'input[type=url]',
      'input[type=datetime-local]',
      'input[type=date]',
      'input[type=month]',
      'input[type=time]',
      'input[type=week]',
      'textarea',
      'select'
    ].reduce((acc, value, i) => `${acc}${i === 0 ? '' : ','}${value}${add || ''}`, '')
  }

  getInputFieldsWithControl (add) {
    return [
      'input[type=radio]',
      'input[type=checkbox]'
    ].reduce((acc, value, i) => `${acc}${i === 0 ? '' : ','}${value}${add || ''}`, '')
  }

  get submit () {
    return this.root.querySelector('input[type=submit]')
  }
}
