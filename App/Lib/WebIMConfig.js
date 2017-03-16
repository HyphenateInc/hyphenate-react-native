'use strict';

/**
 * git do not control webim.config.js
 * everyone should copy webim.config.js.demo to webim.config.js
 * and have their own configs.
 * In this way , others won't be influenced by this config while git pull.
 *
 */

// for react native
let location = {
    protocol: 'https'
};

let config = {
  /*
   * XMPP server
   */
    xmppURL: 'im-api.hyphenate.io',
  /*
   * Backend REST API URL
   */
    // ios must be https!!!
    apiURL: 'https://api.hyphenate.io',
  /*
   * Application AppKey
   */
    appkey: 'hyphenatedemo#hyphenatedemo',
  /*
   * Whether to use HTTPS
   * @parameter {Boolean} true or false
   */
    https: true,
  /*
   * isMultiLoginSessions
   * true: A visitor can sign in to multiple webpages and receive messages at all the webpages.
   * false: A visitor can sign in to only one webpage and receive messages at the webpage.
   */
    isMultiLoginSessions: false,
    /**
     * Whether to use window.doQuery()
     * @parameter {Boolean} true or false
     */
    isWindowSDK: false,
    /**
     * isSandBox=true:  xmppURL: 'im-api.sandbox.hyphenate.io',  apiURL: '//a1.sdb.hyphenate.io',
     * isSandBox=false: xmppURL: 'im-api.hyphenate.io',          apiURL: '//a1.hyphenate.io',
     * @parameter {Boolean} true or false
     */
    isSandBox: false,
    /**
     * Whether to console.log in strophe.log()
     * @parameter {Boolean} true or false
     */
    isDebug: true,
    /**
     * will auto connect the xmpp server autoReconnectNumMax times in background when client is offline.
     * won't auto connect if autoReconnectNumMax=0.
     */
    autoReconnectNumMax: 2,
    /**
     * the interval time in seconds between each auto reconnection.
     * works only if autoReconnectMaxNum >= 2.
     */
    autoReconnectInterval: 2,
    /**
     * webrtc supports WebKit and https only
     */
    isWebRTC: /WebKit/.test(navigator.userAgent) && /^https\:$/.test(window.location.protocol),
  /*
   * Set to auto sign-in
   */
    isAutoLogin: true
};

export default config
