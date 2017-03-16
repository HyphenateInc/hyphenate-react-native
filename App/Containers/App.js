// @flow

// import React, {Component} from 'react'   // exchangeable as "var React = require('React');"
var React = require('React');

import {Provider, connect} from 'react-redux'
import {Alert, View} from 'react-native'
import '../I18n/I18n' // keep before root container
import RootContainer from './RootContainer'
import createStore from '../Redux'
import applyConfigSettings from '../Config'

import I18n from 'react-native-i18n'
import WebIM from '../Lib/WebIM'
import LoginActions from '../Redux/LoginRedux'
import SubscribeActions from '../Redux/SubscribeRedux'
import BlacklistActions from '../Redux/BlacklistRedux'
import RosterActions from '../Redux/RosterRedux'
import MessageActions from '../Redux/MessageRedux'
import GroupActions from '../Redux/GroupRedux'
import {Actions as NavigationActions} from 'react-native-router-flux'

const RouterWithRedux = connect()(RootContainer);

// Apply config overrides
applyConfigSettings();
// create our store
const store = createStore();

/**
 * Provides an entry points into demo application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends React.Component {

    constructor() {
        super();
        // store.dispatch(LoginActions.login('apple', 'apple'));    // example account

        WebIM.conn.listen({
            // xmpp connected successfully
            onOpened: (msg) => {
                // send notification if presence
                WebIM.conn.setPresence();
                // get contacts
                store.dispatch(RosterActions.getContacts());
                // login succeed
                store.dispatch(LoginActions.loginSuccess(msg));
                // get blacklist
                store.dispatch(BlacklistActions.getBlacklist());
                // get group list
                store.dispatch(GroupActions.getGroups());

                NavigationActions.contacts();
            },

            // presence status
            onPresence: (msg) => {
                console.debug('onPresence', msg, store.getState());
                switch (msg.type) {
                    case 'subscribe':
                        // Add friend is a process of two ways subscription
                        // if both parties agree to add each other as friend, then one party will subscribe automatically
                        // Does not need notification, indicated as state=[resp:true]
                        if (msg.status === '[resp:true]') {
                            return;
                        }
                        store.dispatch(SubscribeActions.addSubscribe(msg));
                        break;
                    case 'subscribed':
                        store.dispatch(RosterActions.getContacts());
                        Alert.alert(msg.from + ' ' + I18n.t('subscribed'));
                        break;
                    case 'unsubscribe':
                        // TODO: partial UI refresh
                        store.dispatch(RosterActions.getContacts());
                        break;
                    case 'unsubscribed':
                        // un-friended
                        store.dispatch(RosterActions.getContacts());
                        Alert.alert(msg.from + ' ' + I18n.t('unsubscribed'));
                        break;
                }
            },

            // Errors
            onError: (error) => {
                console.log(error);

                // 16: server-side close the websocket connection
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
                    console.log('WEBIM_CONNCTION_DISCONNECTED', WebIM.conn.autoReconnectNumTotal, WebIM.conn.autoReconnectNumMax);
                    if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
                        return;
                    }
                    Alert.alert('Error', 'server-side close the websocket connection');
                    NavigationActions.login();
                    return;
                }
                // 8: logout due to l
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
                    console.log('WEBIM_CONNCTION_SERVER_ERROR');
                    Alert.alert('Error', 'offline by multi login');
                    NavigationActions.login();
                    return;
                }
                // login error
                if (error.type == 1) {
                    let data = error.data ? error.data.data : '';
                    data && Alert.alert('Error', data);
                    store.dispatch(LoginActions.loginFailure(error));
                }
            },

            // disconnected
            onClosed: (msg) => {
                console.log('onClosed');
            },

            // blacklist updated
            onBlacklistUpdate: (list) => {
                store.dispatch(BlacklistActions.updateBlacklist(list));
            },

            // text message received
            onTextMessage: (message) => {
                console.log('onTextMessage', message);
                store.dispatch(MessageActions.addMessage(message, 'txt'));
            },

            // picture message received
            onPictureMessage: (message) => {
                console.log('onPictureMessage', message);
                store.dispatch(MessageActions.addMessage(message, 'img'));
            }
        })
    }

    componentWillReceiveProps() {
    }

    render() {
        return (
            <Provider store={store}>
              <RouterWithRedux />
            </Provider>
        )
    }
}

export default App
