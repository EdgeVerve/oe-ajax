/* 
  ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
  Bangalore, India. All Rights Reserved.
*/
// Once 
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";
import {Base} from '@polymer/polymer/polymer-legacy.js';
import "@polymer/iron-ajax/iron-request.js";
import "oe-utils/oe-utils.js";

/**
 * # oe-ajax
 * 
 * The `oe-ajax` element exposes network request functionality.
 * 
 * ```
 * <oe-ajax auto url="http://gdata.youtube.com/feeds/api/videos/"
 *         params='{"alt":"json", "q":"chrome"}'
 *         handle-as="json" on-response="handleResponse"
 *         debounce-duration="300"></oe-ajax>
 * ```
 * 
 * With `auto` set to `true`, the element performs a request whenever
 * its `url`, `params` or `body` properties are changed. Automatically generated
 * requests will be debounced in the case that multiple attributes are changed
 * sequentially.
 * 
 * Note: The `params` attribute must be double quoted JSON.
 * 
 * You can trigger a request explicitly by calling `generateRequest` on the
 * element.
 * 
 * @customElement
 * @polymer
 * @appliesMixin OECommonMixin
 * @demo /demo/index.html
 */
class OeAjax extends OECommonMixin(PolymerElement) {
  static get is() { return 'oe-ajax'; }

  /** 
   * Fired before a request is sent.
   * Details contains 'request' and 'requestOptions' object.
   * @event oe-ajax-presend
   */

  /**
   * Fired after a response is received.
   * Details is the 'request' object. 
   * @event oe-ajax-postreceive
   */

  /**
   * Fired when a request is sent.
   *
   * @event request
   */

  /**
   * Fired when a request is sent.
   *
   * @event oe-ajax-request
   */

  /**
   * Fired when a response is received.
   *
   * @event response
   */

  /**
   * Fired when a response is received.
   *
   * @event oe-ajax-response
   */

  /**
   * Fired when an error is received.
   *
   * @event error
   */

  /**
   * Fired when an error is received.
   *
   * @event oe-ajax-error
   */


  static get template() {
    return null;
  }

  static get hostAttributes() {
    return {
      hidden: true
    };
  }

  static get properties() {
    return {
      /**
       * The URL target of the request.
       */
      url: {
        type: String
      },

      /**
       * An object that contains query parameters to be appended to the
       * specified `url` when generating a request. If you wish to set the body
       * content when making a POST request, you should use the `body` property
       * instead.
       */
      params: {
        type: Object,
        value: function () {
          return {};
        }
      },

      /**
       * The HTTP method to use such as 'GET', 'POST', 'PUT', or 'DELETE'.
       * Default is 'GET'.
       */
      method: {
        type: String,
        value: 'GET'
      },

      /**
       * HTTP request headers to send.
       *
       * Example:
       *
       *     <oe-ajax
       *         auto
       *         url="http://somesite.com"
       *         headers='{"X-Requested-With": "XMLHttpRequest"}'
       *         handle-as="json"></oe-ajax>
       *
       * Note: setting a `Content-Type` header here will override the value
       * specified by the `contentType` property of this element.
       */
      headers: {
        type: Object,
        value: function () {
          return {};
        }
      },

      /**
       * Content type to use when sending data. If the `contentType` property
       * is set and a `Content-Type` header is specified in the `headers`
       * property, the `headers` property value will take precedence.
       *
       * Varies the handling of the `body` param.
       */
      contentType: {
        type: String,
        value: null
      },

      /**
       * Body content to send with the request, typically used with "POST"
       * requests.
       *
       * If body is a string it will be sent unmodified.
       *
       * If Content-Type is set to a value listed below, then
       * the body will be encoded accordingly.
       *
       *    * `content-type="application/json"`
       *      * body is encoded like `{"foo":"bar baz","x":1}`
       *    * `content-type="application/x-www-form-urlencoded"`
       *      * body is encoded like `foo=bar+baz&x=1`
       *
       * Otherwise the body will be passed to the browser unmodified, and it
       * will handle any encoding (e.g. for FormData, Blob, ArrayBuffer).
       *
       * @type (ArrayBuffer|ArrayBufferView|Blob|Document|FormData|null|string|undefined|Object)
       */
      body: {
        type: Object,
        value: null
      },

      /**
       * Toggle whether XHR is synchronous or asynchronous. Don't change this
       * to true unless You Know What You Are Doing™.
       */
      sync: {
        type: Boolean,
        value: false
      },

      /**
       * Specifies what data to store in the `response` property, and
       * to deliver as `event.detail.response` in `response` events.
       *
       * One of:
       *
       *    `text`: uses `XHR.responseText`.
       *
       *    `xml`: uses `XHR.responseXML`.
       *
       *    `json`: uses `XHR.responseText` parsed as JSON.
       *
       *    `arraybuffer`: uses `XHR.response`.
       *
       *    `blob`: uses `XHR.response`.
       *
       *    `document`: uses `XHR.response`.
       */
      handleAs: {
        type: String,
        value: 'json'
      },

      /**
       * Set the withCredentials flag on the request.
       */
      withCredentials: {
        type: Boolean,
        value: false
      },

      /**
       * Set the timeout flag on the request.
       */
      timeout: {
        type: Number,
        value: 0
      },

      /**
       * If true, automatically performs an Ajax request when either `url` or
       * `params` changes.
       */
      auto: {
        type: Boolean,
        value: false
      },

      /**
       * If true, error messages will automatically be logged to the console.
       */
      verbose: {
        type: Boolean,
        value: false
      },

      /**
       * The most recent request made by this oe-ajax element.
       *
       * @type {Object|undefined}
       */
      lastRequest: {
        type: Object,
        notify: true,
        readOnly: true
      },

      /**
       * The `progress` property of this element's `lastRequest`.
       *
       * @type {Object|undefined}
       */
      lastProgress: {
        type: Object,
        notify: true,
        readOnly: true
      },

      /**
       * True while lastRequest is in flight.
       */
      loading: {
        type: Boolean,
        notify: true,
        readOnly: true
      },

      /**
       * lastRequest's response.
       *
       * Note that lastResponse and lastError are set when lastRequest finishes,
       * so if loading is true, then lastResponse and lastError will correspond
       * to the result of the previous request.
       *
       * The type of the response is determined by the value of `handleAs` at
       * the time that the request was generated.
       *
       * @type {Object}
       */
      lastResponse: {
        type: Object,
        notify: true,
        readOnly: true
      },

      /**
       * lastRequest's error, if any.
       *
       * @type {Object}
       */
      lastError: {
        type: Object,
        notify: true,
        readOnly: true
      },

      /**
       * An Array of all in-flight requests originating from this oe-ajax
       * element.
       */
      activeRequests: {
        type: Array,
        notify: true,
        readOnly: true,
        value: function () {
          return [];
        }
      },

      /**
       * Length of time in milliseconds to debounce multiple automatically generated requests.
       */
      debounceDuration: {
        type: Number,
        value: 0,
        notify: true
      },

      /**
       * Prefix to be stripped from a JSON response before parsing it.
       *
       * In order to prevent an attack using CSRF with Array responses
       * (http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/)
       * many backends will mitigate this by prefixing all JSON response bodies
       * with a string that would be nonsensical to a JavaScript parser.
       *
       */
      jsonPrefix: {
        type: String,
        value: ''
      },

      /**
       * By default, oe-ajax's events do not bubble. Setting this attribute will cause its
       * request and response events as well as its oe-ajax-request, -response,  and -error
       * events to bubble to the window object. The vanilla error event never bubbles when
       * using shadow dom even if this.bubbles is true because a scoped flag is not passed 
       * it (first link) and because       * the shadow dom spec did not used to allow certain events, including
       * events named error, to leak outside of shadow trees (second link).
       * https://www.w3.org/TR/shadow-dom/#scoped-flag
       * https://www.w3.org/TR/2015/WD-shadow-dom-20151215/#events-that-are-not-leaked-into-ancestor-trees
       */
      bubbles: {
        type: Boolean,
        value: false
      },

      /**
       * Changes the [`completes`](iron-request#property-completes) promise chain
       * from `generateRequest` to reject with an object
       * containing the original request, as well an error message.
       * If false (default), the promise rejects with an error message only.
       */
      rejectWithRequest: {
        type: Boolean,
        value: false
      },

      _boundHandleResponse: {
        type: Function,
        value: function () {
          return this._handleResponse.bind(this);
        }
      }
    };
  }
  static get observers() {
    return [
      '_requestOptionsChanged(url, method, params.*, headers, contentType,body, sync, handleAs, jsonPrefix, withCredentials, timeout, auto)'
    ];
  }

  /**
   * The query string that should be appended to the `url`, serialized from
   * the current value of `params`.
   *
   * @return {string}
   */
  get queryString() {
    var queryParts = [];
    var value;
    var self = this;

    this.params && Object.keys(this.params).forEach(function (param) {
      value = self.params[param];
      param = window.encodeURIComponent(param);

      if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
          queryParts.push(param + '=' + window.encodeURIComponent(value[i]));
        }
      } else if (value !== null) {
        queryParts.push(param + '=' + window.encodeURIComponent(value));
      } else {
        queryParts.push(param);
      }
    });

    return queryParts.join('&');
  }

  /**
   * The `url` with query string (if `params` are specified), suitable for
   * providing to an `iron-request` instance.
   *
   * @return {string}
   */
  get requestUrl() {
    var queryString = this.queryString;
    var url = this.url || '';

    if (queryString) {
      var bindingChar = url.indexOf('?') >= 0 ? '&' : '?';
      return window.OEUtils.geturl(url) + bindingChar + queryString;
    }

    return window.OEUtils.geturl(url);
  }

  /**
   * An object that maps header names to header values, first applying the
   * the value of `Content-Type` and then overlaying the headers specified
   * in the `headers` property.
   *
   * @return {Object}
   */
  get requestHeaders() {
    var headers = {};
    var contentType = this.contentType;
    if (contentType == null && (typeof this.body === 'string')) {
      contentType = 'application/x-www-form-urlencoded';
    }
    if (contentType) {
      headers['content-type'] = contentType;
    }
    var authToken = sessionStorage.auth_token;
    if (authToken) {
      headers.Authorization = authToken;
    }

    if (this._defaultSettings.headers instanceof Object) {
      var _defaultHeaders = this._defaultSettings.headers;
      _defaultHeaders && Object.keys(_defaultHeaders).forEach(function (header) {
        headers[header] = _defaultHeaders[header].toString();
      });
    }

    if (this.headers instanceof Object) {
      var self = this;
      this.headers && Object.keys(this.headers).forEach(function (header) {
        headers[header] = self.headers[header].toString();
      });
    }

    return headers;
  }

  /**
   * Request options suitable for generating an `iron-request` instance based
   * on the current state of the `oe-ajax` instance's properties.
   *
   * @return {{
   *   url: string,
   *   method: (string|undefined),
   *   async: (boolean|undefined),
   *   body: (ArrayBuffer|ArrayBufferView|Blob|Document|FormData|null|string|undefined|Object),
   *   headers: (Object|undefined),
   *   handleAs: (string|undefined),
   *   jsonPrefix: (string|undefined),
   *   withCredentials: (boolean|undefined)
   *   rejectWithRequest: (boolean|undefined)}}
   */
  toRequestOptions() {
    if(!this._defaultSettings){
      var OEUtils = window.OEUtils;
      OEUtils = OEUtils || {};
      OEUtils.componentDefaults = OEUtils.componentDefaults || {};
      OEUtils.componentDefaults["oe-ajax"] = OEUtils.componentDefaults["oe-ajax"] || {};
      this._defaultSettings = OEUtils.componentDefaults["oe-ajax"];
    }
    return {
      url: this.requestUrl || '',
      method: this.method,
      headers: this.requestHeaders,
      body: this.body,
      async: !this.sync,
      handleAs: this.handleAs,
      jsonPrefix: this.jsonPrefix,
      withCredentials: this.withCredentials,
      timeout: this.timeout || this._defaultSettings.timeout || 0,
      rejectWithRequest: this.rejectWithRequest,
    };
  }

  /**
   * Performs an AJAX request to the specified URL.
   *
   * @return {!IronRequestElement}
   */
  generateRequest() {
    var request = /** @type {!IronRequestElement} */ (document.createElement('iron-request'));

    var enableCertificate = window.CERTIFICATE_PINNED || false;

    if (window.cordova && enableCertificate) {
      request.send = this.__enableCertificatePinning.bind(request);
    }

    var requestOptions = this.toRequestOptions();

    this.push('activeRequests', request);

    request.completes.then(this._boundHandleResponse)
      .catch(this._handleError.bind(this, request))
      .then(this._discardRequest.bind(this, request));

    var evt = this.fire(
      'oe-ajax-presend', {
        request: request,
        options: requestOptions
      }, {
        bubbles: true,
        cancelable: true
      });

    if (evt.defaultPrevented) {
      request.abort();
      request.rejectCompletes(request);
      return request;
    }

    if (this.lastRequest) {
      this.lastRequest.removeEventListener(
        'iron-request-progress-changed', this._boundOnProgressChanged);
    }

    request.addEventListener(
      'iron-request-progress-changed', this._boundOnProgressChanged);
    request.send(requestOptions);
    this._setLastProgress(null);
    this._setLastRequest(request);
    this._setLoading(true);

    this.fire(
      'request', {
        request: request,
        options: requestOptions
      }, {
        bubbles: this.bubbles,
        composed: true
      });

    this.fire('oe-ajax-request', {
      request: request,
      options: requestOptions
    }, {
        bubbles: this.bubbles,
        composed: true
      });

    return request;
  }

  _handleResponse(request) {
    
    /* Allow modification of response */
    var evt = this.fire('oe-ajax-postreceive', request);

    if (request === this.lastRequest) {
      this._setLastResponse(request.response);
      this._setLastError(null);
      this._setLoading(false);
    }
    this.fire('response', request, {
      bubbles: this.bubbles,
      composed: true
    });
    this.fire('oe-ajax-response', request, {
      bubbles: this.bubbles,
      composed: true
    });
  }

  _handleError(request, error) {
    if (this.verbose) {
      Base._error(error);
    }

    if (request === this.lastRequest) {
      this._setLastError({
        request: request,
        error: error,
        status: request.xhr.status,
        statusText: request.xhr.statusText,
        response: request.xhr.response
      });
      this._setLastResponse(null);
      this._setLoading(false);
    }

    // Tests fail if this goes after the normal this.fire('error', ...)
    this.fire('oe-ajax-error', {
      request: request,
      error: error
    }, {
        bubbles: this.bubbles,
        composed: true
      });

    this.fire(
      'error', {
        request: request,
        error: error
      }, {
        bubbles: this.bubbles,
        composed: true
      });
  }

  _discardRequest(request) {
    var requestIndex = this.activeRequests.indexOf(request);

    if (requestIndex > -1) {
      this.splice('activeRequests', requestIndex, 1);
    }
  }

  _requestOptionsChanged() {
    this.debounce('generate-request', function () {
      if (this.url == null) {
        return;
      }

      if (this.auto) {
        this.generateRequest();
      }
    }.bind(this), this.debounceDuration);
  }


  /**
   * In case of certificate pinning, the request is diverted through a cordova plugin(cordova-plugin-advanced-http) to 
   * perform the necessary certificate verification.
   * 
   * window.CERTIFICATE_PINNED - This is a flag used to control certificate pinning check.
   * window.CERTIFICATE_PINNED = true;
   * 
   * Follow the example below to call the plugin and pass the window.CERTIFICATE_PINNED  status
   *    cordova.plugin.http.enableSSLPinning(window.CERTIFICATE_PINNED, function () {
   *        console.log("Enabled certificate pinning.");
   *    }, function () {
   *        console.log("Error occured while enabling certificate pinning.");
   *    });
   * 
   * The handling of the `body` parameter will vary based on the Content-Type
   * 
   * @param {{
   *   url: string,
   *   method: (string|undefined),
   *   async: (boolean|undefined),
   *   body: (ArrayBuffer|ArrayBufferView|Blob|Document|FormData|null|string|undefined|Object),
   *   headers: (Object|undefined),
   *   handleAs: (string|undefined),
   *   jsonPrefix: (string|undefined),
   *   withCredentials: (boolean|undefined)}} options -
   *     url The url to which the request is sent.
   *     method The HTTP method to use, default is GET.
   *     async By default, all requests are sent asynchronously. To send synchronous requests,
   *         set to false.
   *     body The content for the request body for POST method.
   *     headers HTTP request headers.All keys must be lower case.
   *     handleAs The response type. Default is 'text'.
   *     withCredentials Whether or not to send credentials on the request. Default is false.
   *   timeout: (Number|undefined)
   * @return {Promise}
   */
  __enableCertificatePinning(options) {
    var self = this;

    options.headers["accept"] = {
      'json': 'application/json',
      'text': 'text/plain',
      'html': 'text/html',
      'xml': 'application/xml',
      'arraybuffer': 'application/octet-stream'
    }[options.handleAs];

    //Data Type
    options.serializer = "json";

    options.data = ((typeof (options.body)) === "object") ? options.body : JSON.parse(options.body);
    options.body = null;
    //Deciding to encode or not
    var plainURL = options.url;
    var OEUtils = window.OEUtils;
    var requestParts = plainURL.split("?");
    if (requestParts.length > 1) {

      var base = requestParts[0];
      var path = requestParts[1];
      var originalURL = path;
      var decodedURL = decodeURI(originalURL);
      var finalURL = null;

      /*A case where the URL is not encoded*/
      if (decodedURL === originalURL) {
        finalURL = encodeURI(originalURL);
      } else {
        finalURL = originalURL;
      }

      finalURL = base + "?" + finalURL;
      finalURL = OEUtils.geturl(finalURL);
    } else {
      finalURL = OEUtils.geturl(plainURL);
    }
    var cordova = window.cordova;
    cordova.plugin.http.sendRequest(finalURL, options, function (response) {

      self._setStatus(response.status);
      self._setStatusText(response.statusText || '');
      self._setResponse(JSON.parse(response.data));

      self.resolveCompletes(self);

    }, function (response) {

      if (response.status === -1) {
        alert('Unexpected error occured.');
        return;
      }

      self._setStatus(response.status);
      self._setStatusText(response.statusText || '');
      self._setResponse(JSON.parse(response.error));

      var xhrObj = {
        status: response.status,
        statusText: response.statusText || '',
        response: JSON.parse(response.error)
      };

      self._setXhr(xhrObj);
      self.rejectCompletes(new Error('The request failed with status code: ' + response.status));
      return;
    });

    return this.completes;
  }
}

window.customElements.define(OeAjax.is, OeAjax);