/*
 * Cookie Consent
 *
 * Owned By - Tripla
 * Author - Alan Strickland
 *
 * This script must be independent of jQuery as it will be loaded prior to jQuery.
 */

(function () {
  /*! js-cookie v2.2.1 | MIT | https://github.com/js-cookie/js-cookie */
  !(function (a) {
    var b;
    if (('function' == typeof define && define.amd && (define(a), (b = !0)), 'object' == typeof exports && ((module.exports = a()), (b = !0)), !b)) {
      var c = window.Cookies,
        d = (window.Cookies = a());
      d.noConflict = function () {
        return (window.Cookies = c), d;
      };
    }
  })(function () {
    function a() {
      for (var a = 0, b = {}; a < arguments.length; a++) {
        var c = arguments[a];
        for (var d in c) b[d] = c[d];
      }
      return b;
    }
    function b(a) {
      return a.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
    }
    function c(d) {
      function e() {}
      function f(b, c, f) {
        if ('undefined' != typeof document) {
          (f = a({ path: '/' }, e.defaults, f)), 'number' == typeof f.expires && (f.expires = new Date(1 * new Date() + 864e5 * f.expires)), (f.expires = f.expires ? f.expires.toUTCString() : '');
          try {
            var g = JSON.stringify(c);
            /^[\{\[]/.test(g) && (c = g);
          } catch (j) {}
          (c = d.write ? d.write(c, b) : encodeURIComponent(c + '').replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent)),
            (b = encodeURIComponent(b + '')
              .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
              .replace(/[\(\)]/g, escape));
          var h = '';
          for (var i in f) f[i] && ((h += '; ' + i), !0 !== f[i] && (h += '=' + f[i].split(';')[0]));
          return (document.cookie = b + '=' + c + h);
        }
      }
      function g(a, c) {
        if ('undefined' != typeof document) {
          for (var e = {}, f = document.cookie ? document.cookie.split('; ') : [], g = 0; g < f.length; g++) {
            var h = f[g].split('='),
              i = h.slice(1).join('=');
            c || '"' !== i.charAt(0) || (i = i.slice(1, -1));
            try {
              var j = b(h[0]);
              if (((i = (d.read || d)(i, j) || b(i)), c))
                try {
                  i = JSON.parse(i);
                } catch (k) {}
              if (((e[j] = i), a === j)) break;
            } catch (k) {}
          }
          return a ? e[a] : e;
        }
      }
      return (
        (e.set = f),
        (e.get = function (a) {
          return g(a, !1);
        }),
        (e.getJSON = function (a) {
          return g(a, !0);
        }),
        (e.remove = function (b, c) {
          f(b, '', a(c, { expires: -1 }));
        }),
        (e.defaults = {}),
        (e.withConverter = c),
        e
      );
    }
    return c(function () {});
  });

  // Polyfill for creating CustomEvents on IE9/10/11

  // code pulled from:
  // https://github.com/d4tocchini/customevent-polyfill
  // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

  if (typeof window === 'undefined') {
    return;
  }

  try {
    var ce = new window.CustomEvent('test', { cancelable: true });
    ce.preventDefault();
    if (ce.defaultPrevented !== true) {
      // IE has problems with .preventDefault() on custom events
      // http://stackoverflow.com/questions/23349191
      throw new Error('Could not prevent default');
    }
  } catch (e) {
    var CustomEvent = function (event, params) {
      var evt, origPrevent;
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined,
      };

      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      origPrevent = evt.preventDefault;
      evt.preventDefault = function () {
        origPrevent.call(this);
        try {
          Object.defineProperty(this, 'defaultPrevented', {
            get: function () {
              return true;
            },
          });
        } catch (e) {
          this.defaultPrevented = true;
        }
      };
      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent; // expose definition to window
  }
})();

(function () {
  const CookieConsent = function () {
    //This must be kept in sync with the type RED.Application.Storefront.CookieConsent
    const defaultConfig = {};

    const defaultConsentState = {
      dialogopen: true,
      full: false,
      necessary: true,
      functional: false,
      personalisation: false,
      analytics: false,
      advertising: false,
    };

    const necessaryConsentState = {
      full: false,
      necessary: true,
      functional: false,
      personalisation: false,
      analytics: false,
      advertising: false,
    };

    const fullConsentState = {
      full: true,
      necessary: true,
      functional: true,
      personalisation: true,
      analytics: true,
      advertising: true,
    };

    const closeDialogState = { dialogopen: false };

    let config = {};

    /*
     * Record the customers current consent state.
     */
    let consentState = defaultConsentState;

    /*
     * Default state of the switches
     */
    let defaultSwitchState = defaultConsentState;

    /*
     * Determines whether we should request consent.
     */
    let requestConsent = true;

    /*
     * The container element for the dialog.
     */
    let dialogElement;

    /*
     * A number of buttons that must be included in the interface.
     */
    const buttons = {};

    /*
     * Value used to grant google consent mode for a category
     */
    const googleConsentModeGranted = 'granted';

    /*
     * Value used to deny google consent mode for a category
     */
    const googleConsentModeDenied = 'denied';

    /*
     * Query the document for a selector.
     */
    function queryElement(selector, element) {
      element = element || document;
      return element.querySelector(selector);
    }

    /*
     * Query the document for a selector.
     */
    function queryElementAll(selector, element) {
      element = element || document;
      return element.querySelectorAll(selector);
    }

    /*
     * Get standardised name for an attribute.
     */
    function getAttributeName(suffix) {
      return `data-consent-${suffix}`;
    }

    /*
     * Get standardised selector for an attribute.
     */
    function getAttributeSelector(suffix) {
      return `[${getAttributeName(suffix)}]`;
    }

    /*
     * Hide an element.
     */
    function hideElement(element) {
      element.setAttribute(getAttributeName('uistate'), 'hidden');
    }

    /*
     * Show an element
     */
    function showElement(element) {
      element.setAttribute(getAttributeName('uistate'), 'visible');
    }

    /*
     * handle an event
     */
    function on(element, event, callback) {
      if (element) element.addEventListener(event, callback);
    }

    /*
     * handle an event
     */
    function oneach(elements, event, callback) {
      if (elements) {
        for (var i = 0; i < elements.length; i++) {
          on(elements[i], event, callback);
        }
      }
    }

    /*
     * Raise an event
     */
    function raiseEvent(element, name, detail) {
      element.dispatchEvent(
        new CustomEvent(`cookie-consent-${name}`, {
          detail: detail,
          bubbles: true,
          cancelable: true,
          composed: false,
        })
      );
    }

    /*
     * Gets a cookie name specific to the current channel.
     */
    function getCookieName() {
      return config.cookie_name;
    }

    /*
     * Read the configuraton of the cookie consent.
     */
    function initConfig() {
      let newConfig = { ...defaultConfig };

      let configElement = queryElement(getAttributeSelector('config'));
      if (configElement) newConfig = { ...newConfig, ...JSON.parse(configElement.dataset.consentConfig) };

      //If google consent mode is enabled then update the category of any scripts
      if (newConfig.enable_google_consent_mode && newConfig.script_definitions && newConfig.script_definitions.length > 0) {
        for (let definition of newConfig.script_definitions) {
          if (definition.googleConsentModeCategory) {
            definition.oldCategory = definition.category;
            definition.category = definition.googleConsentModeCategory;
          }
        }
      }

      //If on full consent state only defined scripts should be enabled configure the full consent state so only the consent state categories are applied
      if (newConfig.on_full_consent_enable_defined_scripts_only) {
        fullConsentState.full = false;
      }

      //Set the class level config property
      config = newConfig;

      let defaultStateElement = queryElement(getAttributeSelector('defaultstate'));
      if (defaultStateElement) defaultSwitchState = { ...defaultConsentState, ...JSON.parse(configElement.dataset.consentDefaultstate) };

      info('Config', config);
      info('Default Consent', defaultConsentState);
      info('Default Switch State', defaultSwitchState);
    }

    /*
     * Read the consent state from the cookie and set to default state when cookies doesn't exist.
     */
    function initConsentState() {
      let cookie = Cookies.get(getCookieName());

      if (!cookie) {
        cookie = setDefaultCookieState();
      }

      let newConsentState = JSON.parse(cookie) || defaultConsentState;

      //Validate the Necessary flag... is it necessary to have this in the config?
      if (!newConsentState.necessary) {
        newConsentState.necessary = true;
        storeContentState(newConsentState);
      }

      //The cookie already existed so the customer has already specified their consent.
      requestConsent = newConsentState.dialogopen;

      //Record the consent state
      consentState = newConsentState;
    }

    /*
     * Set the consent cookie to the specified state;
     */
    function storeContentState(state) {
      let previousState = consentState;

      //Necessary can never be set to false.
      if (!state.necessary) {
        state.necessary = true;
      }

      var expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + config.cookie_expiry_in_days);

      state.expiryDate = expiryDate;

      state.full = state.functional && state.personalisation && state.analytics && state.advertising;
      consentState = state;

      Cookies.set(getCookieName(), JSON.stringify(state), { expires: config.cookie_expiry_in_days, path: '/', sameSite: 'Strict', secure: true });

      raiseEvent(document, 'updated', {
        previousState: previousState,
        newState: state,
      });
    }

    /*
     * Sets the default cookie state when the cookie does not exist.
     */
    function setDefaultCookieState() {
      storeContentState(defaultConsentState);

      return Cookies.get(getCookieName());
    }

    /*
     * Gets the dialog element from the document
     */
    function initUserInterfaceElements() {
      dialogElement = queryElement(getAttributeSelector('dialog'));
      if (!dialogElement && console && error) {
        error('No consent dialog is available, all customers will have only the necessary cookies enabled.');
      }

      if (dialogElement) {
        buttons.openDialogButton = queryElement(getAttributeSelector('opendialog'));
        buttons.acceptAllButton = queryElementAll(getAttributeSelector('acceptall'), dialogElement);
        buttons.acceptNecessaryButton = queryElementAll(getAttributeSelector('acceptnecessary'), dialogElement);
        buttons.openCustomiseSectionButton = queryElement(getAttributeSelector("customise='open'"), dialogElement);
        buttons.saveCustomiseSectionButton = queryElement(getAttributeSelector("customise='save'"), dialogElement);
        buttons.closeCustomiseSectionButton = queryElement(getAttributeSelector("customise='close'"), dialogElement);
      }
    }

    /*
     * Start the dialog state
     */
    function startUserInterface() {
      if (dialogElement) {
        requestConsent ? openConsentDialog(dialogElement) : closeConsentDialog(dialogElement);

        on(buttons.openDialogButton, 'click', () => {
          openConsentDialog(dialogElement);
        });

        oneach(buttons.acceptAllButton, 'click', () => {
          acceptAllCookies();
          closeCustomiseSection(dialogElement);
          closeConsentDialog(dialogElement);
        });

        oneach(buttons.acceptNecessaryButton, 'click', () => {
          acceptNecessaryCookies();
          closeConsentDialog(dialogElement);
        });

        on(buttons.openCustomiseSectionButton, 'click', () => {
          toggleCustomiseSection(dialogElement);
        });

        on(buttons.saveCustomiseSectionButton, 'click', () => {
          customiseCookies(dialogElement);
          closeCustomiseSection(dialogElement);
          closeConsentDialog(dialogElement);
        });

        on(buttons.closeCustomiseSectionButton, 'click', () => {
          closeCustomiseSection(dialogElement);
        });
      }
    }

    /*
     * Fires an event to open the consent dialog.
     */
    function openConsentDialog(element) {
      showElement(element);

      raiseEvent(element, 'dialog-show', {
        dialog: dialogElement,
      });

      hideOpenCookieConsentButton();

      closeCustomiseSection(element);
    }

    /*
     * Fires an event to close the consent dialog.
     */
    function closeConsentDialog(element) {
      hideElement(element);

      raiseEvent(element, 'dialog-hide', {
        dialog: dialogElement,
      });

      showOpenCookieConsentButton();
    }

    /*
     * Fires an event to open the customise section of the dialog.
     */
    function toggleCustomiseSection(element) {
      let configureElement = queryElement(getAttributeSelector('configure'), element);

      if (configureElement.getAttribute(getAttributeName('uistate')) === 'visible') {
        closeCustomiseSection(element);
      } else {
        openCustomiseSection(element);
      }
    }

    /*
     * Fires an event to open the customise section of the dialog.
     */
    function openCustomiseSection(element) {
      let configureElement = queryElement(getAttributeSelector('configure'), element);
      let controlsElement = queryElement(getAttributeSelector('controls'), element);
      let switchState = defaultSwitchState;

      if (consentState.full || consentState.customised) {
        switchState = consentState;
      }

      //Update the checkbox states based on the current consent state
      setOptionCheckedState(element, 'necessary', switchState.necessary);
      setOptionCheckedState(element, 'functional', switchState.functional);
      setOptionCheckedState(element, 'personalisation', switchState.personalisation);
      setOptionCheckedState(element, 'analytics', switchState.analytics);
      setOptionCheckedState(element, 'advertising', switchState.advertising);

      showElement(configureElement);

      hideElement(controlsElement);

      raiseEvent(configureElement, 'customise-show', {
        dialog: dialogElement,
        configure: configureElement,
        controls: controlsElement,
      });
    }

    /*
     * Sets the checked state of the specified option
     */
    function setOptionCheckedState(container, name, state) {
      queryElement(`[data-consent-configure-option="${name}"]`, container).checked = state;
    }

    /*
     * Sets the checked state of the specified option
     */
    function getOptionCheckedState(container, name) {
      return queryElement(`[data-consent-configure-option="${name}"]`, container).checked;
    }

    /*
     * Fires an event to close the customise section of the dialog.
     */
    function closeCustomiseSection(element) {
      let configureElement = queryElement(getAttributeSelector('configure'), element);
      let controlsElement = queryElement(getAttributeSelector('controls'), element);

      hideElement(configureElement);

      showElement(controlsElement);

      raiseEvent(configureElement, 'customise-hide', {
        dialog: dialogElement,
        configure: configureElement,
        controls: controlsElement,
      });
    }

    /*
     * Hides the open cookie consent dialog button.
     */
    function hideOpenCookieConsentButton() {
      let element = buttons.openDialogButton;

      hideElement(element);

      raiseEvent(dialogElement, 'opendialog-hide', {
        dialog: dialogElement,
        openButton: element,
      });
    }

    /*
     * Shows the open cookie consent dialog button.
     */
    function showOpenCookieConsentButton() {
      let element = buttons.openDialogButton;

      showElement(element);

      raiseEvent(dialogElement, 'opendialog-show', {
        dialog: dialogElement,
        openButton: element,
      });
    }

    /*
     * The customer has accepted all cookies.
     */
    function acceptAllCookies() {
      storeContentState({ ...fullConsentState, ...closeDialogState });
    }

    /*
     * The customer has accepted necessary cookie.
     */
    function acceptNecessaryCookies() {
      storeContentState({ ...necessaryConsentState, ...closeDialogState });
    }

    /*
     * The customer has chosen to customise their consent.
     */
    function customiseCookies(element) {
      let state = { ...defaultConsentState };
      state.functional = getOptionCheckedState(element, 'functional');
      state.personalisation = getOptionCheckedState(element, 'personalisation');
      state.analytics = getOptionCheckedState(element, 'analytics');
      state.advertising = getOptionCheckedState(element, 'advertising');
      state.full = state.functional && state.personalisation && state.analytics && state.advertising;
      state.customised = true;
      storeContentState({ ...state, ...closeDialogState });
    }

    /*
     * Has the customer given full consent.
     */
    function hasFullConsent() {
      return consentState.Full;
    }

    /*
     * A function that is called when the cookie policy is ready to accept custom event handling.
     */
    let readyFunc = () => {};

    /*
     * Do something when the cookie consent is ready.
     */
    const ready = (x) => {
      readyFunc = x;
    };

    /*
     * Starts consent integration with google.
     */
    function startIntegrationConsent() {
      window.dataLayer = window.dataLayer || [];

      if (config.enable_google_consent_mode) {
        //ensure the datalayer exists - we do not support customer data layers at this point.

        function gtag() {
          dataLayer.push(arguments);
        }

        gtag('consent', 'default', {
          ad_storage: googleConsentModeDenied,
          analytics_storage: googleConsentModeDenied,
          functionality_storage: googleConsentModeDenied,
          personalization_storage: googleConsentModeDenied,
          security_storage: googleConsentModeGranted,
          wait_for_update: 500,
        });

        gtag('set', 'ads_data_redaction', true);

        if (consentState.analytics || consentState.advertising || consentState.functional || consentState.personalisation) {
          updateGoogleConsentMode(consentState);
        }
      }

      //Raise the tag manager event with the current state.
      raiseTagManagerEvent();
    }

    /*
     * Ensure google consent has the right state
     */
    function updateGoogleConsentMode() {
      if (config.enable_google_consent_mode) {
        //ensure the datalayer exists - we do not support customer data layers at this point.
        window.dataLayer = window.dataLayer || [];

        function gtag() {
          dataLayer.push(arguments);
        }

        gtag('consent', 'update', {
          ad_storage: consentState.advertising ? googleConsentModeGranted : googleConsentModeDenied,
          analytics_storage: consentState.analytics ? googleConsentModeGranted : googleConsentModeDenied,
          functionality_storage: consentState.functional ? googleConsentModeGranted : googleConsentModeDenied,
          personalization_storage: consentState.personalisation ? googleConsentModeGranted : googleConsentModeDenied,
          security_storage: consentState.necessary ? googleConsentModeGranted : googleConsentModeDenied,
        });
      }
    }

    /*
     * Safely show an error message.
     */
    function log() {
      if (config.debug && console && console.log) {
        conssole.log.call(arguments);
      }
    }

    /*
     * Safely show an error message.
     */
    function info() {
      if (config.debug && console && console.info) {
        console.info.apply(null, arguments);
      }
    }

    /*
     * Safely show a warning message.
     */
    function warn() {
      if (console && console.warn) {
        console.warn.apply(null, arguments);
      }
    }

    /*
     * Safely show an error message.
     */
    function error() {
      if (console && console.error) {
        console.error.apply(null, arguments);
      }
    }

    /*
     * Determines if a script is allowed.
     */
    function determineScriptState(config, state, script) {
      function escapeRegExp(string) {
        return string.replace(/[.*+?^}{$()|[\]\\]/g, '\\$&'); // $& means the whole matched string
      }

      const defaultScriptState = { allowed: false, ignore: false, category: '', src: null };

      //The script has already been processed and is allowed
      if (script.hasAttribute(getAttributeName('scriptstate'))) {
        return script.dataset.consentScriptstate;
      }
      defaultScriptState.src = script.src || script.dataset.consentSrc || '';

      //There is no src tag, it is embedded so enable the script by default
      if (!defaultScriptState.src) {
        let scriptState = {
          ...defaultScriptState,
          ...{
            allowed: true,
          },
        };

        return scriptState;
      }

      //The script has been given a category in the source.
      if (defaultScriptState.src && script.hasAttribute(getAttributeName('category'))) {
        let category = script.getAttribute(getAttributeName('category'));

        let scriptState = {
          ...defaultScriptState,
          ...{
            allowed: state[category],
            category: category,
          },
        };

        return scriptState;
      }

      //Check the config for any allowed scripts that match the script src.
      if (defaultScriptState.src && config && config.script_definitions) {
        for (let definition of config.script_definitions) {
          if (!definition.regex) {
            if (definition.url_match_type === 'Regular Expression') {
              definition.regex = new RegExp(definition.url, 'i');
            } else if (definition.url_match_type === 'Starts With') {
              definition.regex = new RegExp('^' + escapeRegExp(definition.url), 'i');
            } else {
              definition.regex = new RegExp('^' + escapeRegExp(definition.url) + '$', 'i');
            }
          }

          if (definition.regex.test(defaultScriptState.src)) {
            let category = definition.category;

            let scriptState = {
              ...defaultScriptState,
              ...{
                allowed: state[category],
                category: category,
                definition: definition,
              },
            };

            return scriptState;
          }
        }
      }

      warnScript(script);

      //If the state is full acceptance than allow all scripts.
      if (state.full) {
        let scriptState = {
          ...defaultScriptState,
          ...{
            allowed: true,
          },
        };

        return scriptState;
      }

      //The default state is returned for anything else
      return defaultScriptState;
    }

    /*
     * Enable a script.
     */
    function enableScript(script, scriptState) {
      if (scriptState.src) {
        let newScript = {};

        if (!script.src) {
          newScript = script; //document.createElement("script");

          newScript.src = scriptState.src;
          newScript.setAttribute(getAttributeName('category'), scriptState.category);
          newScript.dataset.consentScriptstate = scriptState;

          script.parentNode.replaceChild(newScript, script);

          setTimeout(function () {}, 50);
        }

        info(`Script ${scriptState.src} has been enabled by cookie consent.`, newScript, script, scriptState);
      }
    }

    /*
     * Warns that an unknown script has been included
     */
    function warnScript(script) {
      warn(`Script ${script.src} has been included but is unknown to cookie consent.`, script);
    }

    /*
     * Disables a script.
     */
    function disableScript(script, scriptState) {
      warn(`Script ${scriptState.src} has been disabled by cookie consent.`, script, scriptState);
      script.parentNode.removeChild(script);
    }

    /*
     * Handle any mutations of script elements
     */
    function handleMutations(mutations) {
      for (let mutation of mutations) {
        if (mutation.addedNodes) {
          for (let node of mutation.addedNodes) {
            if (node.nodeType === 1 && node.nodeName === 'SCRIPT') {
              let script = node;
              let scriptState = determineScriptState(config, consentState, script);

              if (scriptState.allowed) {
                enableScript(script, scriptState);
              } else {
                disableScript(script, scriptState);
              }
            }
          }
        }
      }
    }

    /*
     * Start observing the DOM to stop any scripts from executing.
     */
    function startScriptInjectionProtection() {
      if (config.enable_script_observer) {
        // select the target node
        const target = document.documentElement || document.body;

        // create an observer instance
        const observer = new MutationObserver((mutations) => handleMutations(mutations));

        // configuration of the observer:
        let obconfig = {
          childList: true,
          subtree: true,
        };

        // pass in the target node, as well as the observer options
        observer.observe(target, obconfig);
      }
    }

    /*
     * Updates a category of scripts, enabling those scripts on the page.
     */
    function updateScriptState(category, categoryState) {
      const selector = `script[data-consent-scriptstate]`;
      for (let script of document.querySelectorAll(selector)) {
        let scriptState = script.dataset.consentScriptstate;

        if (scriptState && scriptState.category === category && scriptState.allowed !== categoryState) {
          info(`Script ${scriptState.src} state changed`);

          scriptState.allowed = categoryState;
          script.setAttribute(getAttributeName('scriptstate'), scriptState);

          if (scriptState.allowed && scriptState.src) enableScript(script, scriptState);
          if (!scriptState.allowed) disableScript(script, scriptState);
        }
      }
    }

    /*
     * Raise an event in tag manager detailing the categories that are granted consent.
     */
    function raiseTagManagerEvent() {
      let categories = [];

      for (let category in consentState) {
        if (consentState[category] && category !== 'full') {
          categories.push(category);
        }
      }

      window.dataLayer.push({
        event: 'cookie-consent',
        'cookie-consent-state': categories.join(','),
      });
    }

    function startConsentUpdateHandler() {
      //When consent is updated
      document.addEventListener('cookie-consent-updated', (event) => {
        //Update the google consent mode
        updateGoogleConsentMode();

        //Raise an event in tag manager
        raiseTagManagerEvent();

        //handle any other scripts that are hard-coded and current disabled
        let previousState = event.detail.previousState;
        let newState = event.detail.newState;

        if (previousState.functional != newState.functional) {
          updateScriptState('functional', newState.functional);
        }

        if (previousState.personalisation != newState.personalisation) {
          updateScriptState('personalisation', newState.personalisation);
        }

        if (previousState.analytics != newState.analytics) {
          updateScriptState('analytics', newState.analytics);
        }

        if (previousState.advertising != newState.advertising) {
          updateScriptState('advertising', newState.advertising);
        }
      });
    }

    /*
     * Initialise the scripst embedded in the page.
     */
    function initScripts() {
      const selector = 'script:not([data-consent-ignore]):not([data-consent-scriptstate]):not([type="text/x-jquery-tmpl"]):not([type="application/ld+json"])';

      for (let script of document.querySelectorAll(selector)) {
        let scriptState = determineScriptState(config, consentState, script);

        if (scriptState.allowed) {
          enableScript(script, scriptState);
        } else {
          disableScript(script, scriptState);
        }
      }
    }

    /*
     * CookieConsent class constructor.
     */
    function constructor() {
      initConfig();

      initConsentState();

      startScriptInjectionProtection();

      startIntegrationConsent();

      startConsentUpdateHandler();

      window.addEventListener('DOMContentLoaded', (event) => {
        initScripts();

        initUserInterfaceElements();

        if (readyFunc) {
          readyFunc(dialogElement);
        }

        startUserInterface();
      });
    }

    //start the cookie consent
    constructor();

    return {
      consentState: consentState,
    };
  };

  //Start the cookie consent by constructing a cookie consent instance.
  window.cookieConsent = window.cookieConsent || new CookieConsent();
})();
