/* global self */
/* global location */

const currentScriptUrl = new URL(document.currentScript.src)

// @ts-ignore
self.Environment = {
  isTestingEnv: location.hostname === 'localhost' || location.hostname.includes('.local') || location.hostname.includes('umb.') || location.hostname.includes('test.') || location.hostname.includes('testadmin.'),
  language: currentScriptUrl.searchParams.get('language') || document.documentElement.getAttribute('lang') || 'de',
  contentfulEndpoint: currentScriptUrl.searchParams.get('contentfulEndpoint') || 'https://graphql.contentful.com/content/v1/spaces/',
  msrcBaseUrl: currentScriptUrl.searchParams.get('msrcBaseUrl') || 'https://cdn.migros.ch',
  msrcVersion: currentScriptUrl.searchParams.get('msrcVersion') || '20251104054240',
  mcsBaseUrl: currentScriptUrl.searchParams.get('mcsBaseUrl') || 'https://digital-campaign-factory.migros.ch',
  mcsVersion: currentScriptUrl.searchParams.get('mcsVersion'), /* || 'v1.112.3', // the newest version gets fetched if this parameter is not set */
  /**
   * Get custom mobile breakpoint
   * @param {{constructor?: string, tagName?: string, namespace?: string}} organism
   * @return {string}
   */
  mobileBreakpoint: ({ constructor, tagName, namespace } = {}) => {
    switch (true) {
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Header'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Logo'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Navigation'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('LanguageSwitcher'):
      case tagName && typeof tagName.includes === 'function' && tagName.includes('O-NAV-WRAPPER'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Footer'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('Login'):
      case constructor && typeof constructor.includes === 'function' && constructor.includes('CarouselTwo') && namespace === 'carousel-two-teaser-':
        return '1200px'
      default:
        return '767px'
    }
  },
  getApiBaseUrl: function (type) {
    switch (type) {
      case 'zadb':
        return currentScriptUrl.searchParams.get('zadbEndpoint') || this.isTestingEnv ? 'https://testadmin.betriebsrestaurants-migros.ch/umbraco/api/ZadbApi' : 'https://admin.betriebsrestaurants-migros.ch/umbraco/api/ZadbApi'
      case 'migrospro': {
        return {
          apiAddToFavorites: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProFavoriteApi/AddToFavorites' : 'https://www.migrospro.ch/umbraco/api/MigrosProFavoriteApi/AddToFavorites',
          apiAddToOrder: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProOrderApi/AddToOrder' : 'https://www.migrospro.ch/umbraco/api/MigrosProOrderApi/AddToOrder',
          apiAddFavoritesToOrder: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProFavoriteApi/AddFavoritesToOrder' : 'https://www.migrospro.ch/umbraco/api/MigrosProFavoriteApi/AddFavoritesToOrder',
          apiDeleteFromFavoriteList: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProFavoriteApi/RemoveFromFavorites' : 'https://www.migrospro.ch/umbraco/api/MigrosProFavoriteApi/RemoveFromFavorites',
          apiDeleteFromOrder: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProOrderApi/DeleteFromOrder' : 'https://www.migrospro.ch/umbraco/api/MigrosProOrderApi/DeleteFromOrder',
          apiGetActiveOrderAndOrderItems: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProOrderApi/GetActiveOrderAndOrderItems' : 'https://www.migrospro.ch/umbraco/api/MigrosProOrderApi/GetActiveOrderAndOrderItems',
          apiGetActiveOrderAndOrderItemsEnrichedProductData: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProOrderApi/GetActiveOrderAndOrderItemsEnrichedProductData' : 'https://www.migrospro.ch/umbraco/api/MigrosProOrderApi/GetActiveOrderAndOrderItemsEnrichedProductData',
          apiGetActiveOrderId: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProOrderApi/GetActiveOrderId' : 'https://www.migrospro.ch/umbraco/api/MigrosProOrderApi/GetActiveOrderId',
          apiGetAllFavoriteOrders: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProFavoriteApi/GetAllOrders' : 'https://www.migrospro.ch/umbraco/api/MigrosProFavoriteApi/GetAllOrders',
          apiGetAllFavorites: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProFavoriteApi/GetAllFavorites' : 'https://www.migrospro.ch/umbraco/api/MigrosProFavoriteApi/GetAllFavorites',
          apiGetAllStores: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProOrderApi/GetAllStores' : 'https://www.migrospro.ch/umbraco/api/MigrosProOrderApi/GetAllStores',
          apiGetProductByCategory: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProProductApi/GetProductsByCategory' : 'https://www.migrospro.ch/umbraco/api/MigrosProProductApi/GetProductsByCategory',
          apiGetProductsBySearch: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProProductApi/GetProductsBySearch' : 'https://www.migrospro.ch/umbraco/api/MigrosProProductApi/GetProductsBySearch',
          apiOrderCheckoutSaveForLater: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProOrderApi/OrderCheckoutSaveForLater' : 'https://www.migrospro.ch/umbraco/api/MigrosProOrderApi/OrderCheckoutSaveForLater',
          apiOrderCheckoutSubmit: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProOrderApi/OrderCheckoutSubmit' : 'https://www.migrospro.ch/umbraco/api/MigrosProOrderApi/OrderCheckoutSubmit',
          apiRemoveFromOrder: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProOrderApi/RemoveFromOrder' : 'https://www.migrospro.ch/umbraco/api/MigrosProOrderApi/RemoveFromOrder',
          apiToggleDefaultOrder: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProOrderApi/ToggleDefaultOrder' : 'https://www.migrospro.ch/umbraco/api/MigrosProOrderApi/ToggleDefaultOrder',
          apiToggleFavorite: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProFavoriteApi/ToggleFavoriteState' : 'https://www.migrospro.ch/umbraco/api/MigrosProFavoriteApi/ToggleFavoriteState',
          apiUpdateOrderItem: this.isTestingEnv ? 'https://testadmin.migrospro.ch/umbraco/api/MigrosProOrderApi/UpdateOrderItem' : 'https://www.migrospro.ch/umbraco/api/MigrosProOrderApi/UpdateOrderItem'
        }
      }
      default:
        return ''
    }
  }
}

/**
 * XSS Content Security Policy
 * NOTE: this function is copied into other repos using this as submodule. !adjust those when adjusting this function!
 * 
 * https://content-security-policy.com/examples/meta/
 * is enforced by: <meta http-equiv="Content-Security-Policy" content="require-trusted-types-for 'script'">
 * 
 * Sink uses trusted type only: https://web.dev/articles/trusted-type
 * Avoid XSS attacks by sanitizing the html according to: https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS
 * and the target list: https://github.com/cure53/DOMPurify/blob/27e8496bcd689a16acc7d0bf7c88b933efad569a/demos/hooks-mentaljs-demo.html#L20
 * plus: https://stackoverflow.com/questions/6976053/xss-which-html-tags-and-attributes-can-trigger-javascript-events
 * stackoverflow citation and conclusion: "I didn't knew about those new attributes. I checked, and it seems that the only attributes that start with on are all Javascript event triggers. I will probably just remove all that match that pattern."
 * NOTE: script tags are already automatically escaped by modern browsers, so we only target <image, <img starting tags and "javascript:"
 *
 * @static
 * @param {string} html
 * @return {string}
 */
if (typeof self.trustedTypes?.createPolicy === 'function' && !self.trustedTypes.defaultPolicy && document.querySelector('meta[http-equiv=Content-Security-Policy][content*=require-trusted-types-for]')) {
  const sanitizer = typeof Sanitizer === 'function'
    ? new Sanitizer({}) // make a custom sanitizer which removes all XSS
    : null
  self.trustedTypes.createPolicy('default', {
    // first sanitize tags eg.: <img src="xyz" onload=alert('XSS')>, <img src="xyz" onmouseover=alert('XSS')>, <image/src/onerror=alert('XSS')>, etc.
    // second sanitize tags eg.: <a href="javascript:alert(document.location);">XSS</a>, <form action="javascript:alert(document.location);"><input type="submit" /></form>, etc.
    // complex look ahead: (?:"[^"]*"|'[^']*'|[^'">])* to fix what a selector like [^>]* would not catch: <img src='x>yz' onerror=alert('XSS')>
    createHTML: sanitizer && typeof Document.parseHTML === 'function'
      ? string => Document.parseHTML(string, { sanitizer }).body.innerHTML
      : string => string.replace(/<[a-zA-Z][a-zA-Z0-9._-]*(?=(?:"[^"]*"|'[^']*'|[^'">])*(?:(\bon[a-z]{2,})\s*=|(?:href|src|action|formaction|poster|data|xlink:href)\s*=\s*["']?([^"'<>]*)(?::|&colon;?|&#(?:x0*3a|0*58);?)))(?:"[^"]*"|'[^']*'|[^'">])*>/gi, (match, captureAttributeName, captureAttributeValue) => {
        if (captureAttributeName) return '' // included an attribute eg. onerror=
        if (captureAttributeValue && /(javascript|vbscript|data:|&(?:#[0-9]{1,7}|#x[0-9a-f]{1,6}|[a-z][a-z0-9]{1,31}(?=;|[^a-z0-9=-])))/i.test(captureAttributeValue.replace(/[\u0000-\u0020]/g, ''))) return '' // included an attribute value eg. ="javascript:"
        return match
      }), // eslint-disable-line
    createScriptURL: string => string, // unsafe but including webworker's, service workers, etc. is okay
    createScript: string => string // unsafe but eval at css templates is okay
  })
}
