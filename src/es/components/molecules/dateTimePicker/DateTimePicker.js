// @ts-check
// @ts-check
import { Shadow } from '../../prototypes/Shadow.js'

/**
 * Navigation hosts uls
 * Example at: /src/es/components/pages/Home.html
 * As a molecule, this component shall hold Atoms
 *
 * @export
 * @class DateTimePicker
 * @type {CustomElementConstructor}
 * @attribute {
 * }
 */

export default class DateTimePicker extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    // TODO create warning if picker-type doesn't exist
    this.pickerType = this.getAttribute("picker-type")
    // TODO create warning if picker-format doesn't exist
    this.pickerFormat = this.getAttribute("picker-format").toLowerCase() ?? 'dd/mm/yyyy'
    this.pickerFormatChar = "/"
    this.splittedFormat = this.getSplittedFormat(this.pickerFormat)
    // TODO fill out if it has default value
    this.dateState = {
      d: '',
      m: '',
      y: ''
    }

    this.formAsPattern = (event) => {
      const currentInput = event.data
      const currentValue = this.inputField.value
      const currentValueLength = currentValue.length
      let currentValueLengthAsIndex = currentValue.length - 1


      // from here
      if (currentInput === null) {
        console.log('delete', this.pickerFormat[currentValueLength])
        if (this.pickerFormat[currentValueLength] === this.pickerFormatChar) {
          console.log('dont remove')
        }
      } else if (currentValue.length > 0 && this.pickerFormat[currentValueLengthAsIndex] === 'd') {
        this.dateState.d = this.dateState.d + currentInput
      } else if (this.pickerFormat[currentValueLengthAsIndex] === 'm') {
        console.log("m")
      } else if (this.pickerFormat[currentValueLengthAsIndex] === 'y') {
        console.log("y")
      } else {
        console.log('other')
        console.log('other', this.dateState)

      }
    }

    this.setNotAllowedKeys = (event) => {
      const keyCode = event.which
      if (keyCode == 32) {
        event.preventDefault()
        return false
      }
      else if (keyCode != 46 && (keyCode < 48 || keyCode > 57)) {
        event.preventDefault()
        return false
      }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.inputField) this.inputField.addEventListener('keypress', this.setNotAllowedKeys)
    if (this.inputField) this.inputField.addEventListener('input', this.formAsPattern)

  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.inputField) this.inputField.removeEventListener('keypress', this.setNotAllowedKeys)
    if (this.inputField) this.inputField.removeEventListener('input', this.formAsPattern)

  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML() {
    return !this.root.querySelector('input')
  }

  /**
   * renders the m-multi-level-navigation css
   *
   * @return {Promise<void>|void}
   */
  renderCSS() {
    this.css = /* css */`
    :host { }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate() {
    /** @type {import('../../prototypes/Shadow.js').fetchCSSParams[]} */
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
      case 'date-time-picker-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false,
          replaces: [{
            pattern: '--date-time-picker-default-',
            flags: 'g',
            replacement: '--date-time-picker-default-'
          }]
        }, ...styles], false)
      default:
        return Promise.resolve()
    }
  }

  /**
   *
   *
   * @return {Promise<void>|void}
   */
  renderHTML() {
    let inputField = document.createElement('input')
    if (this.pickerPattern) inputField.setAttribute('pattern', this.pickerPattern)
    if (this.pickerType === 'birth') {
      this.html = inputField
    } else {

    }
    return
  }

  getSplittedFormat = (format) => {
    if (format.includes('/')) return this.pickerFormatChar = '/', format.split('/')
    if (format.includes('.')) return this.pickerFormatChar = '.', format.split('.')
    if (format.includes('-')) return this.pickerFormatChar = '-', format.split('-')
    return
  }

  get inputField() {
    return this.root.querySelector('input')
  }
}
