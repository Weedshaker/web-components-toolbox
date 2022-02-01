// @ts-check
import { Shadow } from '../../prototypes/Shadow.js'

/* global self */
/* global Link */
/* global Arrow */
/* global customElements */
/* global CustomEvent */

/**
 * Navigation hosts uls
 * Example at: /src/es/components/pages/Home.html
 * As a molecule, this component shall hold Atoms
 *
 * @export
 * @class Navigation
 * @type {CustomElementConstructor}
 * @attribute {
 *  {boolean} [hover=false]
 *  {boolean} [hit-area=true] this lets you define a hit-area of your link, to avoid too large focus (hit-area) by fonts too large line-height, which can't be overwritten with css: https://github.com/mits-gossau/web-components-cms-template/issues/53
 *  {boolean} [focus-lost-close=false] tell it to close when focus is lost
 * }
 * @css {
 *  --content-spacing [40px]
 *  --a-link-content-spacing [0]
 *  --a-link-font-size [1rem]
 *  --background-color [black]
 *  --list-style [none]
 *  --align-items [start]
 *  --min-width [100px] of list items at second level
 *  --padding-top [6px] first list item at second level
 *  --hr-color [white]
 *  --a-link-font-size-mobile [2rem]
 *  --font-weight-mobile [normal]
 *  --a-link-text-align-mobile [center]
 *  --justify-content-mobile [center]
 *  --a-arrow-color-hover [--color-hover, white]
 *  --a-arrow-color [#777]
 *  --min-height-mobile [50px]
 *  --min-width-mobile [50px]
 * }
 */
export default class Navigation extends Shadow() {
  constructor (...args) {
    super(...args)

    this.nav = document.createElement('nav')
    this.hidden = true
    Array.from(this.root.children).forEach(node => {
      if (node.getAttribute('slot') || node.nodeName === 'STYLE') return false
      this.nav.appendChild(node)
    })
    this.root.appendChild(this.nav)

    this.isDesktop = this.checkMedia('desktop')
    // desktop keep gray background in right position
    this.clickListener = event => {
      this.setFocusLostClickBehavior()
      // header removes no-scroll at body on resize, which must be avoided if navigation is open
      // console.log('changed', this.isDesktop === (this.isDesktop = this.checkMedia('desktop')));
      if (this.hasAttribute('no-scroll') && this.isDesktop === (this.isDesktop = this.checkMedia('desktop')) && ((!this.isDesktop && this.classList.contains('open')) || (this.isDesktop && this.root.querySelector('li.open')))) document.documentElement.classList.add(this.getAttribute('no-scroll') || 'no-scroll')
      let section
      if ((section = this.root.querySelector('li.open section'))) {
        if (this.checkMedia('desktop')) {
          this.style.textContent = /* css */`
          :host > nav > ul > li.open > div.background {
            top: ${section.getBoundingClientRect().bottom}px;
          }
        `
        }
      }
      this.liClickListener(event)
    }
    // on resize or click keep ul open in sync
    // remove open class
    this.liClickListener = event => {
      if (event && event.target) {
        this.root.querySelector('nav > ul:not(.language-switcher)').classList[event.target.parentNode && event.target.parentNode.classList.contains('open') ? 'add' : 'remove']('open')
        if (this.checkMedia('mobile')) {
          Array.from(this.root.querySelectorAll('li.open')).forEach(link => {
            if (link !== event.target.parentNode) link.classList.remove('open')
          })
        }
      }
    }
    // correct the arrow direction when closing the menu on global or parent event
    this.selfClickListener = event => Array.from(this.root.querySelectorAll('nav > ul:not(.language-switcher) > li > a-link')).forEach(aLink => {
      const arrow = aLink.parentNode.querySelector('a-arrow')
      if (arrow) arrow.setAttribute('direction', aLink.classList.contains('open') || aLink.parentNode.classList.contains('open') ? 'left' : 'right')
    })
  }

  connectedCallback () {
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()
    self.addEventListener('resize', this.clickListener)
    self.addEventListener('click', this.selfClickListener)
    this.setFocusLostClickBehavior()
  }

  disconnectedCallback () {
    self.removeEventListener('resize', this.clickListener)
    self.removeEventListener('click', this.selfClickListener)
    this.root.querySelectorAll('a-link').forEach(link => link.removeEventListener('click', this.clickListener))
    this.root.querySelectorAll('nav > ul:not(.language-switcher) > li').forEach(link => link.removeEventListener('click', this.liClickListener))
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
    return this.hidden
  }

  /**
   * renders the m-navigation css
   *
   * @return {void}
   */
  renderCSS () {
    const firstLevelCount = this.root.querySelectorAll('nav > ul > li').length
    this.css = /* css */`
      :host{
        color: black;
        overscroll-behavior: contain;
      }
      :host a-link {
        --padding: var(--a-link-content-spacing, 14px 10px);
        --font-size: var(--a-link-font-size, 1rem);
        --font-weight: var(--a-link-font-weight);
        --line-height: var(--a-link-line-height);
        --text-transform: var(--a-link-text-transform);
        font-family: var(--a-link-font-family, var(--font-family));
        font-weight: var(--a-font-weight, var(--font-weight, normal));
      }
      :host(.${this.getAttribute('no-scroll') || 'no-scroll'}) a-link {
        --color: var(--a-link-color-${this.getAttribute('no-scroll') || 'no-scroll'});
        --padding: var(--a-link-content-spacing-${this.getAttribute('no-scroll') || 'no-scroll'}, 14px 10px);
        --font-size: var(--a-link-font-size-${this.getAttribute('no-scroll') || 'no-scroll'}, 1rem);
        --font-weight: var(--a-link-font-weight-${this.getAttribute('no-scroll') || 'no-scroll'});
        --line-height: var(--a-link-line-height-${this.getAttribute('no-scroll') || 'no-scroll'});
      }
      :host(.${this.getAttribute('no-scroll') || 'no-scroll'}) > nav > ul li ul a-link {
        --font-size: var(--a-link-second-level-font-size, 1rem);
        --font-weight: var(--a-link-second-level-font-weight, var(--a-link-font-weight));
        --line-height: var(--a-link-second-level-line-height);
        font-family: var(--a-link-second-level-font-family, var(--font-family));
        font-weight: var(--a-font-weight, var(--font-weight, normal));
      }
      ${(this.getAttribute('hover') === 'true' &&
      `:host > nav > ul li:hover ul a-link,
      :host > nav > ul li ul:hover a-link,`) || ''}
      :host > nav > ul li a-link.open ~ ul a-link {
        --font-size: var(--a-link-second-level-font-size-${this.getAttribute('no-scroll') || 'no-scroll'}, 1rem);
        --font-weight: var(--a-link-second-level-font-weight-${this.getAttribute('no-scroll') || 'no-scroll'}, var(--a-link-font-weight-${this.getAttribute('no-scroll') || 'no-scroll'}));
        --line-height: var(--a-link-second-level-line-height-${this.getAttribute('no-scroll') || 'no-scroll'});
      }
      :host(.${this.getAttribute('no-scroll') || 'no-scroll'}) ul {
        background-color: var(--background-color-${this.getAttribute('no-scroll') || 'no-scroll'}, var(--background-color, black));
      }
      :host > nav > ul{
        align-items: var(--align-items, center);
        justify-content: var(--justify-content, normal);
        display: flex;
        flex-wrap: var(--flex-wrap, nowrap);
        flex-direction: var(--flex-direction, row);
        padding: var(--padding, calc(var(--content-spacing, 40px) / 2) 0);
      }
      :host(.${this.getAttribute('no-scroll') || 'no-scroll'}) > nav > ul {
        padding: var(--padding-${this.getAttribute('no-scroll') || 'no-scroll'}, calc(var(--content-spacing, 40px) / 2) 0);
      }
      :host > nav > ul > li{
        display: block;
        padding: var(--li-padding, 0 calc(var(--content-spacing, 40px) / 4));
      }
      :host > nav > ul li > a-arrow {
        display: none;
        user-select: none;
        visibility: hidden;
      }
      :host > nav > ul li:nth-child(n+${firstLevelCount / 2 + 1}) ul{
        top: var(--li-ul-top-second-half, unset);
        right: var(--li-ul-right-second-half, unset);
        bottom: var(--li-ul-bottom-second-half, unset);
        left: var(--li-ul-left-second-half, unset);
      }
      ${(this.getAttribute('hover') === 'true' &&
      `:host > nav > ul li:hover ul,
      :host > nav > ul li ul:hover,`) || ''}
      :host > nav > ul li a-link.open ~ ul {
        display: block;
        margin: var(--li-ul-margin-${this.getAttribute('no-scroll') || 'no-scroll'});
      }
      :host > nav > ul li:last-child ul{
        right: 0;
      }
      :host > nav > ul li:hover{
        cursor: pointer;
      }
      :host > nav > ul > li > ul li {
        margin-bottom: var(--li-ul-margin-bottom, 0);
      }
      :host > nav > ul li ul li {
        min-width: var(--min-width, 100px);
      }
      :host > nav > ul > li > ul > li:first-child{
        padding-top: var(--padding-top, 6px);
        border-top: var(--border-top, 1px solid) var(--hr-color, var(--color, white));
      }
      :host > nav > ul li.open > a-link, :host > nav > ul li.open > a-arrow{
        --color: var(--color-open);
      }
      @media only screen and (max-width: ${this.getAttribute('mobile-breakpoint') ? this.getAttribute('mobile-breakpoint') : self.Environment && !!self.Environment.mobileBreakpoint ? self.Environment.mobileBreakpoint : '1000px'}) {
        :host {
          --font-weight: var(--font-weight-mobile, normal);
        }
        :host a-link {
          --font-size: var(--a-link-font-size-mobile, 2rem);
          --text-align: var(--a-link-text-align-mobile, center);
          --line-height: var(--a-link-line-height-mobile, var(--a-link-line-height, var(--line-height-mobile)));
        }
        :host(.${this.getAttribute('no-scroll') || 'no-scroll'}) a-link {
          --font-size: var(--a-link-font-size-${this.getAttribute('no-scroll') || 'no-scroll'}-mobile, 2rem);
          --line-height: var(--a-link-line-height-${this.getAttribute('no-scroll') || 'no-scroll'}-mobile, var(--a-link-line-height-${this.getAttribute('no-scroll') || 'no-scroll'}, var(--line-height-mobile)));
        }
        :host(.${this.getAttribute('no-scroll') || 'no-scroll'}) > nav > ul li ul a-link {
          --font-size: var(--a-link-second-level-font-size-mobile, var(--a-link-second-level-font-size, 1rem));
        }
        ${(this.getAttribute('hover') === 'true' &&
        `:host > nav > ul li:hover ul a-link,
        :host > nav > ul li ul:hover a-link,`) || ''}
        :host > nav > ul li a-link.open ~ ul a-link {
          --font-size: var(--a-link-second-level-font-size-${this.getAttribute('no-scroll') || 'no-scroll'}-mobile, var(--a-link-second-level-font-size-${this.getAttribute('no-scroll') || 'no-scroll'}, 1rem));
        }
        :host > nav > ul{
          flex-direction: var(--flex-direction-mobile, var(--flex-direction, column));
          padding: 0;
        }
        :host > nav > ul li.open > a-link, :host > nav > ul li.open > a-arrow{
          --color: var(--a-arrow-color-hover, var(--color-hover));
        }
        :host > nav > ul li > a-link{
          flex-grow: 1;
        }
        :host > nav > ul > li:not(.no-arrow) > a-arrow {
          visibility: visible;
        }
        :host > nav > ul > li a-arrow {
          --color: var(--a-arrow-color);
          display: var(--arrow-display, 'block');
          min-height: var(--min-height-mobile, 50px);
          min-width: var(--min-width-mobile, 50px);
        }
        :host > nav > ul li:hover ul,
        :host > nav > ul li:not(.open) a-link.open ~ ul,
        :host > nav > ul li ul:hover{
          display: none;
        }
        :host > nav > ul li.open ul{
          display: block;
        }
        :host > nav > ul > li > ul li {
          flex-wrap: unset;
          margin-bottom: var(--li-ul-margin-bottom-mobile, 0);
        }
        :host > nav > ul li.open > a-link, :host > nav > ul li.open > a-arrow{
          --color: var(--color-open-mobile, var(--color-open));
        }
      }
    `
    // TODO: Migrated two Navigations into one, these should be cleaned and merged properly!
    this.css = /* css */`
      :host > nav > ul {
        background-color: var(--background-color);
        margin: 0;
      }
      :host > nav > .language-switcher {
        display: none;
      }
      :host > nav > ul > li {
        margin: var(--margin);
        border-bottom: 2px solid transparent;
        transition: all 0.1s ease;
      }
      :host > nav > ul > li:hover:not(.search) {
        border-bottom: 2px solid var(--color);
      }
      :host > nav > ul li.open {
        border-bottom: 2px solid var(--color-secondary);
      }
      :host > nav > ul > li > div.background {
        cursor: auto;
        display: none;
        position: fixed;
        background-color: var(--m-gray-500);
        width: 100vw;
        height: 100vw;
        left: 0;
        top: 0;
        opacity: 0;
      }
      :host > nav > ul > li.open > div.background {
        display: block;
        opacity: 0.54;
      }
      :host > nav > ul li > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section {
        --a-link-content-spacing: 0;
        --a-link-font-size: 1rem;
        --a-link-font-weight: normal;
        background-color: var(--background-color, white);
        cursor: auto;
        display: none !important;
        position: absolute;
        left: 0;
        margin-top: 1.7rem;
        overflow: auto;
        box-sizing: border-box;
        max-height: 80vh;
        padding: 2.5rem calc((100% - var(--content-width)) / 2);
        transition: all 0.2s ease;
        z-index: var(--li-ul-z-index, auto);
      }
      :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section {
        display: flex !important;
      }
      :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section > ul > li {
        list-style: var(--list-style, none);
        padding-bottom: 0.5rem;
      }
      :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section > ul > li:first-child, :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section > ul > li.bold {
        --a-link-font-weight: bold;
        --a-link-font-size: 1.25rem;
        padding-bottom: 0.875rem;
      }
      :host > nav > ul > li.search {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
        margin-right: 0;
        padding: var(--search-li-padding, var(--li-padding, 0 calc(var(--content-spacing, 40px) / 4)));
        margin-top: -1.5rem;
      }
      @media only screen and (max-width: ${this.getAttribute('mobile-breakpoint') ? this.getAttribute('mobile-breakpoint') : self.Environment && !!self.Environment.mobileBreakpoint ? self.Environment.mobileBreakpoint : '1000px'}) {
        :host {
          --a-link-content-spacing-no-scroll: 1.1429rem 1.2143rem;
          --a-link-content-spacing: var(--a-link-content-spacing-no-scroll);
          --a-link-font-size-mobile: var(--a-link-font-size-no-scroll-mobile);
          --a-link-font-size-mobile: var(--a-link-font-size-no-scroll-mobile);
          --a-link-font-size-no-scroll-mobile: 1.1429rem;
          --a-link-font-weight: normal;
          --a-link-second-level-font-size-mobile: 1.2857rem;
          --a-link-text-align-mobile: left;
          --height: auto;
          --li-padding: 0;
          --margin: 0;
          --min-height-mobile: 0;
          scrollbar-color: var(--color-secondary) var(--background-color);
        }
        :host > nav {
          background-color: var(--background-color, black);
          display: flex;
          flex-direction: column;
          justify-content: flex-start; /* must be up, otherwise the iphone hides it behind the footer bar */
          min-height: calc(100vh - var(--header-logistik-m-navigation-top-mobile));
        }
        :host > nav > .language-switcher {
          display: flex;
          flex-direction: row;
          justify-content: center;
        }
        :host > nav > .language-switcher > li {
          border: 0;
          width: auto;
        }
        :host > nav > ul > li > a-arrow{
          padding-bottom: 2px;
        }
        :host > nav > .language-switcher > li > a-arrow{
          display: none;
        }
        :host > nav > ul.open > li:not(.open), :host > nav > ul.open ~ ul.language-switcher {
          display: none;
        }
        :host > nav > ul > li{
          align-items: center;
          box-sizing: border-box;
          border-bottom: var(--header-border-bottom);
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        :host > nav > ul > li:hover:not(.search) {
          border-bottom: var(--header-border-bottom);
        }
        :host > nav > ul li.open {
          --a-link-content-spacing-no-scroll: var(--a-link-font-size-no-scroll-mobile) 1.2143rem var(--a-link-font-size-no-scroll-mobile) 0;
          --a-link-content-spacing: var(--a-link-content-spacing-no-scroll);
          --a-link-font-size-mobile: var(--a-link-font-size-no-scroll-mobile);
          --a-link-font-size-no-scroll-mobile: 1.7143rem;
          border-bottom: var(--header-border-bottom);
          flex-direction: row-reverse;
        }
        :host > nav > ul > li > div.background {
          display: none !important;
        }
        :host > nav > ul li a-link {
          display: flex;
          align-items: center;
        }
        :host > nav > ul li > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section {
          margin-top: calc(3rem + 1px);
          max-height: unset;
          padding: 0 0 2.5rem 0;
          z-index: 100;
        }
        :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section {
          --a-link-content-spacing-no-scroll: 0.5rem 0.5rem 0.5rem calc(2rem + 50px);
          --a-link-content-spacing: var(--a-link-content-spacing-no-scroll);
          --a-link-font-size-mobile: 1.1429rem;
          --a-link-second-level-font-size-mobile: var(--a-link-font-size-mobile);
          animation: open .2s ease;
          left: 0;
        }
        :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section > ul {
          --padding-mobile: 0.8571rem 0;
          --padding-first-child-mobile: var(--padding-mobile);
          --padding-last-child-mobile: var(--padding-mobile);
          border-bottom: var(--header-border-bottom);
        }
        :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section > ul:last-child {
          margin-bottom: 100px !important; /* must be up, otherwise the iphone hides it behind the footer bar */
        }
        :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section > ul > li:first-child, :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section > ul > li.bold {
          --a-link-content-spacing-no-scroll: 0.5rem 0.5rem 0.5rem 50px;
          --a-link-content-spacing: var(--a-link-content-spacing-no-scroll);
          --a-link-font-size-mobile: 1.2857rem;
          --a-link-second-level-font-size-mobile: var(--a-link-font-size-mobile);
          padding-bottom: 0;
        }
        :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section > ul > li {
          --line-height-mobile: 1.5em;
          line-height: 0;
          padding-bottom: 0;
        }
        :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section > ul > li.bold {
          border-bottom: var(--header-border-bottom);
          padding: var(--padding-mobile);
        }
        :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section > ul > li.bold:first-child {
          padding-top: 0;
        }
        :host > nav > ul li.open > ${this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper'} > section > ul > li.bold:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }
        :host > nav > ul > li.search > * {
          width: 100%;
        }
        :host > nav > ul > li.search {
          margin-top: 0;
        }
      }
      @keyframes open {
        0% {left: -100vw}
        100% {left: 0}
      }
    `
  }

  /**
   * renders the a-link html
   *
   * @param {string[]} [arrowDirections=['up', 'down']]
   * @return {void}
   */
  renderHTML (arrowDirections = ['left', 'right']) {
    this.loadChildComponents().then(children => {
      Array.from(this.root.querySelectorAll('a')).forEach(a => {
        const li = a.parentElement
        if (!li.querySelector('ul')) li.classList.add('no-arrow')
        const aLink = new children[0][1](a, { namespace: this.getAttribute('namespace') || '', namespaceFallback: this.hasAttribute('namespace-fallback') })
        aLink.setAttribute('hit-area', this.getAttribute('hit-area') || 'true')
        if (this.hasAttribute('set-active')) aLink.setAttribute('set-active', this.getAttribute('set-active'))
        if (a.classList.contains('active')) aLink.classList.add('active')
        const arrow = new children[1][1]({ namespace: this.getAttribute('namespace') || '', namespaceFallback: this.hasAttribute('namespace-fallback') })
        arrow.setAttribute('direction', arrowDirections[1])
        const arrowClickListener = event => {
          if (this.hasAttribute('focus-lost-close-mobile')) Array.from(this.root.querySelectorAll('li.open')).forEach(li => li.classList.remove('open'))
          li.classList.toggle('open')
          arrow.setAttribute('direction', li.classList.contains('open') ? arrowDirections[0] : arrowDirections[1])
        }
        arrow.addEventListener('click', arrowClickListener)
        aLink.addEventListener('click', event => {
          if (event.target) {
            arrowClickListener()
            let a = null
            if (event.target.root && (a = event.target.root.querySelector('a'))) {
              if (!a.getAttribute('href') || a.getAttribute('href') === '#') {
                event.preventDefault()
                if (this.focusLostClose) event.stopPropagation()
                Array.from(this.root.querySelectorAll('a-link.open')).forEach(aLink => {
                  aLink.classList.remove('open')
                  let arrow
                  if (aLink.parentNode && event.target && !aLink.parentNode.classList.contains('open') && (arrow = aLink.parentNode.querySelector(`[direction=${arrowDirections[0]}]`))) arrow.setAttribute('direction', arrowDirections[1])
                })
                event.target.classList.add('open')
              } else if (a.getAttribute('href')[0] === '#') {
                this.dispatchEvent(new CustomEvent(this.getAttribute('click-anchor') || 'click-anchor', {
                  detail: {
                    selector: a.getAttribute('href')
                  },
                  bubbles: true,
                  cancelable: true,
                  composed: true
                }))
              }
            }
          }
        })
        if (this.focusLostClose) {
          self.addEventListener('click', event => {
            if (this.hasAttribute('focus-lost-close-mobile')) {
              Array.from(this.root.querySelectorAll('li.open')).forEach(li => li.classList.remove('open'))
              if (this.hasAttribute('no-scroll')) document.documentElement.classList.remove(this.getAttribute('no-scroll') || 'no-scroll')
            }
            Array.from(this.root.querySelectorAll('a-link.open')).forEach(aLink => {
              aLink.classList.remove('open')
              let arrow
              if (aLink.parentNode && event.target && !aLink.parentNode.classList.contains('open') && (arrow = aLink.parentNode.querySelector(`[direction=${arrowDirections[0]}]`))) arrow.setAttribute('direction', arrowDirections[1])
            })
          })
        }
        li.prepend(arrow)
        a.replaceWith(aLink)
        li.prepend(aLink)
      })
      Array.from(this.root.querySelectorAll('section')).forEach((section, i) => {
        const wrapper = new children[2][1]({ mode: 'false' })
        wrapper.setAttribute('id', `nav-section-${i}`)
        const sectionChildren = Array.from(section.children)
        sectionChildren.forEach((node, i) => {
          if (sectionChildren.length < 4) wrapper.setAttribute(`any-${i + 1}-width`, '25%')
          if (!node.getAttribute('slot')) wrapper.root.appendChild(node)
        })
        section.parentNode.prepend(this.getBackground())
        section.replaceWith(wrapper)
      })
      this.root.querySelectorAll('a-link').forEach(link => link.addEventListener('click', this.clickListener))
      this.root.querySelectorAll('nav > ul:not(.language-switcher) > li').forEach(link => link.addEventListener('click', this.liClickListener))
      this.html = this.style
      this.hidden = false
    })
  }

  /**
   * fetch children when first needed
   *
   * @param {Promise<[string, CustomElementConstructor]>[]} [promises=[]]
   * @returns {Promise<[string, CustomElementConstructor][]>}
   */
  loadChildComponents (promises = []) {
    if (this.childComponentsPromise) return this.childComponentsPromise
    let linkPromise, arrowPromise, wrapperPromise
    try {
      linkPromise = Promise.resolve({ default: Link })
    } catch (error) {
      linkPromise = import('../../atoms/link/Link.js')
    }
    try {
      arrowPromise = Promise.resolve({ default: Arrow })
    } catch (error) {
      arrowPromise = import('../../atoms/arrow/Arrow.js')
    }
    try {
      wrapperPromise = Promise.resolve({ Wrapper: Wrapper })
    } catch (error) {
      wrapperPromise = import('../../organisms/wrapper/Wrapper.js')
    }
    return (this.childComponentsPromise = Promise.all([
      linkPromise.then(
        /** @returns {[string, CustomElementConstructor]} */
        module => ['a-link', module.default]
      ),
      arrowPromise.then(
        /** @returns {[string, CustomElementConstructor]} */
        module => ['a-arrow', module.default]
      ),
      wrapperPromise.then(
        /** @returns {[string, any]} */
        module => [this.getAttribute('o-nav-wrapper') || 'o-nav-wrapper', module.Wrapper(Shadow())]
      ),
      ...promises
    ]).then(elements => {
      elements.forEach(element => {
        // don't define already existing customElements
        // @ts-ignore
        if (!customElements.get(element[0])) customElements.define(...element)
      })
      return elements
    }))
  }

  get focusLostClose () {
    return this.hasAttribute('focus-lost-close') && this.getAttribute('focus-lost-close') !== 'false'
  }

  getBackground () {
    const background = document.createElement('div')
    background.classList.add('background')
    return background
  }

  setFocusLostClickBehavior () {
    clearTimeout(this._focusLostClickBehaviorTimeout)
    this._focusLostClickBehaviorTimeout = setTimeout(() => {
      // the checkMedia is used to hack the click behavior of BaseNavigation to remove on desktop all li.open when  clicked away or in an other menu point. This because we need to indicate the active menu point with a border under the list
      if (this.checkMedia('desktop')) {
        this.setAttribute('focus-lost-close-mobile', '')
      } else {
        this.removeAttribute('focus-lost-close-mobile')
      }
    }, 50)
  }

  /**
   *
   *
   * @param {'mobile' | 'desktop'} [media=this.getAttribute('media')]
   * @returns {boolean}
   * @memberof IntersectionScrollEffect
   */
  checkMedia (media = this.getAttribute('media')) {
    // @ts-ignore ignoring self.Environment error
    const breakpoint = this.getAttribute('mobile-breakpoint') ? this.getAttribute('mobile-breakpoint') : self.Environment && !!self.Environment.mobileBreakpoint ? self.Environment.mobileBreakpoint : '1000px'
    const isMobile = self.matchMedia(`(max-width: ${breakpoint})`).matches
    return (isMobile ? 'mobile' : 'desktop') === media
  }

  get style () {
    return this._style || (this._style = (() => {
      const style = document.createElement('style')
      style.setAttribute('protected', 'true')
      return style
    })())
  }
}
