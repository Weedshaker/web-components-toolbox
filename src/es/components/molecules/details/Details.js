// @ts-check
import { Mutation } from '../../prototypes/Mutation.js'

/* global CustomEvent */
/* global Image */

/**
 * Details (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) aka. Bootstrap accordion
 * As a molecule, this component shall hold Atoms
 *
 * @export
 * @class Details
 * @type {CustomElementConstructor}
 * @css {
 *  --text-align, center
 *  --margin, 0
 *  --padding, 0
 *  --marker-display, none
 *  --marker-content, ""
 *  --summary-cursor, pointer
 *  --summary-text-decoration, underline
 *  --summary-outline, none
 *  --summary-margin, 0
 *  --summary-padding, 0
 *  --summary-text-decoration-open, none
 *  --summary-child-margin, 0
 *  --summary-child-padding, 0
 *  --summary-child-margin-open, 0
 *  --summary-child-padding-open, 0
 *  --child-margin, 0
 *  --child-padding, 0
 *  --animation, 0.1s ease
 *  --child-margin-open, 0
 *  --child-padding-open, 0
 *  --a-color, var(--color)
 *  --close-cursor, pointer
 *  --close-display, block
 *  --close-text-decoration, underline
 *  --close-text-transform, uppercase
 * }
 * @attribute {
 *  {boolean} [open=false] opens the details
 *  {string} [openEventName='open'] the event to which it listens on body
 *  {has} [scroll-into-view=n.a.] scrolls into view if set
 *  {has} [icon-image=n.a] add open/close icon
 * }
 */

// @ts-ignore
export const Details = (ChosenHTMLElement = Mutation()) => class Wrapper extends ChosenHTMLElement {
  constructor (options = {}, ...args) {
    super(Object.assign(options, { mutationObserverInit: { attributes: true, attributeFilter: ['open'] } }), ...args)

    this.svgWidth = '1.5em'
    this.svgHeight = '1.5em'
    this.svgColor = `var(--${this.getAttribute('namespace')}svg-color, var(--color))`
   

    // overwrite default Mutation observer parent function created at super
    this.mutationObserveStart = () => {
      // @ts-ignore
      if (this.details) this.mutationObserver.observe(this.details, this.mutationObserverInit)
    }

    this.openEventListener = event => {
      if (this.details && event.detail.child) {
        if (event.detail.child === this) {
          if (this.hasAttribute('scroll-into-view')) this.details.scrollIntoView({ behavior: 'smooth' })
        } else if (!this.hasAttribute('no-auto-close')) {
          this.details.removeAttribute('open')
        }
      }
    }

    this.clickEventListener = event => {
      if (this.details && event.target && event.target.classList.contains('close')) {
        event.preventDefault()
        this.details.removeAttribute('open')
        if (this.summary.getBoundingClientRect().top < 0) this.details.scrollIntoView({ behavior: 'smooth' })
      }
    }

    this.animationendListener = event => {
      this.details.removeAttribute('open')
      this.mutationObserveStart()
    }
  }

  connectedCallback () {
    super.connectedCallback()
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()
    document.body.addEventListener(this.openEventName, this.openEventListener)
    this.root.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    document.body.removeEventListener(this.openEventName, this.openEventListener)
    this.root.removeEventListener('click', this.clickEventListener)
  }

  mutationCallback (mutationList, observer) {
    mutationList.forEach(mutation => {
      if (mutation.target.hasAttribute('open')) {
        this.style.textContent = ''
        this.setCss(/* CSS */`
          @keyframes open {
            0% {height: 0px}
            100% {height: ${this.content.offsetHeight}px}
          }
        `, undefined, undefined, undefined, this.style)
        this.dispatchEvent(new CustomEvent(this.openEventName, {
          detail: {
            child: this
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      } else {
        this.details.addEventListener('animationend', this.animationendListener, { once: true })
        // in case of fast double click the animationend event would not reach details, since the content would be hidden
        clearTimeout(this.timeoutAnimationend)
        this.timeoutAnimationend = setTimeout(() => {
          this.details.removeEventListener('animationend', this.animationendListener)
          this.animationendListener()
        }, 310)
        this.mutationObserveStop()
        this.details.setAttribute('open', '')
        this.style.textContent = ''
        this.setCss(/* CSS */`
          @keyframes open {
            0% {height: ${this.content.offsetHeight}px}
            100% {height: 0px}
          }
        `, undefined, undefined, undefined, this.style)
      }
    })
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
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderHTML () {
    return !this.divSummary
  }

  /**
   * renders the m-Details css
   *
   * @return {void}
   */
  renderCSS () {
    this.css = /* css */` 
      :host {
        border-bottom:var(--border-bottom, 0);
        border-color: var(--border-color, var(--color));
        border-top: var(--border-top, 0);
        box-sizing: border-box;
        display: var(--display, block);
        margin-bottom: 0 !important;
        margin-top: 0 !important;
      }
      :host(:last-of-type) {
        border-bottom:var(--border-bottom-last, var(--border-bottom, 0));
        border-color: var(--border-color-last, var(--border-color, var(--color)));
      }
      :host details {
        text-align: var(--text-align, center);
        margin: var(--margin, 0);
        padding: var(--padding, 0);
      }
      :host details summary::marker, :host details summary::-webkit-details-marker {
        display: var(--marker-display, none);
        content: var(--marker-content, "");
      }
      :host details summary, :host details summary:focus {
        outline: none;
      }
      :host details[open] summary {
        border-bottom: var(--summary-border-bottom-open, none);
      }
      :host details summary > div {
        cursor: var(--summary-cursor, pointer);
        font-family: var(--summary-font-family, var(--font-family, var(--font-family-bold)));
        font-size:var(--summary-font-size, inherit);
        font-weight: var(--summary-font-weight, var(--font-weight, normal));
        margin: var(--summary-margin, 0);
        outline: var(--summary-outline, none);
        padding: var(--summary-padding, 0);
        text-decoration: var(--summary-text-decoration, var(--a-text-decoration, var(--text-decoration, none)));
        text-transform: var(--summary-text-transform, none);
        text-underline-offset: var(--a-text-underline-offset, unset);
        transition: var(--summary-transition, transform .3s ease);
      }
      :host details summary > div:hover, :host details summary > div:active, :host details summary > div:focus {
        text-decoration: var(--summary-text-decoration-hover, var(--a-text-decoration-hover, var(--text-decoration-hover, var(--a-text-decoration, var(--text-decoration, none)))));
        transform: var(--summary-transform-hover, translate(0,0.1875em));
      }
      :host details[open] summary > div {
        text-decoration: var(--summary-text-decoration-open, none);
        font-family: var(--summary-font-family, var(--font-family-bold, var(--font-family)));
      }
      :host details summary > div > * {
        margin: var(--summary-child-margin, 0);
        padding: var(--summary-child-padding, 0);
      }
      :host details[open] summary > div > * {
        margin: var(--summary-child-margin-open, 0);
        padding: var(--summary-child-padding-open, 0);
      }
      :host details summary ~ * {
        margin: var(--child-margin, 0);
        padding: var(--child-padding, 0);
        overflow: hidden;
      }
      :host details[open] summary ~ * {
        animation: var(--animation, open 0.3s ease-out);
      }
      :host details summary ~ ul, :host details[open] summary ~ ul {
        display: var(--ul-display, inline-block);
        margin: var(--ul-margin, 0 0 0 1em);
      }
      :host details .close {
        color: var(--a-color, var(--color-secondary, var(--color)));
        cursor: var(--close-cursor, pointer);
        display: var(--close-display, block);
        text-decoration: var(--close-text-decoration, var(--a-text-decoration, var(--text-decoration, none)));
        text-underline-offset: var(--a-text-underline-offset, unset);
        text-transform: var(--close-text-transform, uppercase);
      }
      :host details .close:hover, :host details .close:active, :host details .close:focus {
        text-decoration: var(--close-text-decoration-hover, var(--a-text-decoration-hover, var(--text-decoration-hover, var(--a-text-decoration, var(--text-decoration, none)))));
      }
      :host details summary.bold .icon {
        font-weight: bold;
      }
      :host details .icon {
        display: var(--icon-display, flex);
        flex-direction: var(--icon-row, row);
        justify-content: var(--icon-justify-content, center);
        align-items: var(--icon-align-items, flex-start);
      }
      :host details .icon > img, :host details .icon > div > svg {
        transition: var(--icon-transition, transform 0.15s ease);
        margin: var(--icon-margin, 0 1em) !important;
      }
      :host details[open] .icon > img, :host details[open] .icon > div > svg  {
        transform: var(--icon-transform-open, rotate(180deg));
      }
      :host details summary ~ ul.icons, :host details[open] summary ~ ul.icons {
        margin: var(--ul-icons-margin, 0 0 0 1em);
      }
      @media only screen and (max-width: _max-width_) {
        :host {
          margin: 0 5% !important;
          width: 90% !important;
        }
        :host details .icon > img, :host details .icon > div > svg {
          width: var(--icon-width-mobile, min(1.7em, 10vw))
        }
        :host details summary ~ * {
          margin: var(--child-margin-mobile, var(--child-margin, 0));
          padding: var(--child-padding-mobile, var(--child-padding, 0));
        }
        :host details[open] summary ~ * {
          padding: var(--child-padding-open-mobile, var(--child-padding-open, 0));
        }
        :host details summary > div {
          font-size:var(--summary-font-size-mobile, var(--summary-font-size, inherit));
        }
      }
    `

    /** @type {import("../../prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${import.meta.url.replace(/(.*\/)(.*)$/, '$1')}../../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'details-default-':
        return this.fetchCSS([{
          path: `${import.meta.url.replace(/(.*\/)(.*)$/, '$1')}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false)

      default:
        return this.fetchCSS(styles, false)
    }
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    this.divSummary = this.root.querySelector('div.summary') || document.createElement('div')
    this.divSummary.classList.add('summary')
    Array.from(this.summary.childNodes).forEach(node => this.divSummary.appendChild(node))
    this.divSummary = this.getAttribute('icon-image')
      ? this.setIconFromAttribute(this.getAttribute('icon-image'), this.divSummary, 'icon-image')
      : this.setIconDefault(this.divSummary, 'icon')
    this.summary.appendChild(this.divSummary)
    this.html = this.style
  }

  setIconFromAttribute (iconPath, node, cssClass) {
    const iconImg = new Image()
    iconImg.src = iconPath
    iconImg.alt = 'close detail'
    node.append(iconImg)
    node.classList.add(cssClass)
    return node
  }

  setIconDefault (node, cssClass) {
    const iconSvg = document.createElement('div')
    iconSvg.innerHTML = `
      <?xml version="1.0" encoding="UTF-8"?>
      <svg width="${this.svgWidth || '35px'}" height="${this.svgHeight || '20px'}" viewBox="0 0 35 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>Mobile Pfeil</title>
          <g id="Mobile-Pfeil" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <polyline id="Path-2" stroke="${this.svgColor || `var(--color, --${this.namespace}color)`}" stroke-width="3" points="2 3 17 18 32 3"></polyline>
          </g>
      </svg>
    `
    node.append(iconSvg)
    node.classList.add(cssClass)
    return node
  }

  get openEventName () {
    return this.getAttribute('open-event-name') || 'open'
  }

  get summary () {
    return this.root.querySelector('summary')
  }

  get details () {
    return this.root.querySelector('details')
  }

  get content () {
    return this.details.querySelector('summary ~ *')
  }

  get style () {
    return this._style || (this._style = (() => {
      const style = document.createElement('style')
      style.setAttribute('protected', 'true')
      return style
    })())
  }
}
