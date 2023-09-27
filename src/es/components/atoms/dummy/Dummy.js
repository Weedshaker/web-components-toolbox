// @ts-check
import { Shadow } from '../../prototypes/Shadow.js'

/**
* @export
* @class Dummy
* @type {CustomElementConstructor}
*/
export default class Dummy extends Shadow() {
    constructor (options = {}, ...args) {
        super({ importMetaUrl: import.meta.url, ...options }, ...args)
    }

    connectedCallback () {
        if (this.shouldRenderCSS()) this.renderCSS()
        if (this.shouldRenderHTML()) this.renderHTML()
    }

    disconnectedCallback () {}

    /**
     * evaluates if a render is necessary
     *
     * @return {boolean}
     */
    shouldRenderCSS () {
        return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
    }

    /**
     * evaluates if a render is necessary
     *
     * @return {boolean}
     */
    shouldRenderHTML () {
        return !this.div
    }

    /**
     * renders the css
     *
     */
    renderCSS () {
        this.css = /* css */`
        :host {}
        @media only screen and (max-width: _max-width_) {
            :host {}
        }`
        return this.fetchTemplate()
    }

    /**
     * fetches the template
     *
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
            case 'dummy-default-':
                return this.fetchCSS([{
                    path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
                    namespace: false
                }, ...styles], false)
            default:
                return this.fetchCSS(styles)
            }
    }

}