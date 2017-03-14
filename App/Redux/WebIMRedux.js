import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'
import WebIM from '../Lib/WebIM'
import {Actions as NavigationActions, ActionConst} from 'react-native-router-flux'
import RosterActions from '../Redux/RosterRedux'
import GroupActions from '../Redux/GroupRedux'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  // ----------------async------------------
  // logout
  logout: () => {
    return (dispatch, state) => {
      if (WebIM.conn.isOpened()) {
        WebIM.conn.close('logout')
      }

      dispatch({type: 'USER_LOGOUT'});

      NavigationActions.login({type: ActionConst.REPLACE});
    }
  },
});

export const WebIMTypes = Types;
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  msgs: {},
  subscribes: {}
});

/* ------------- Reducers ------------- */

export const subscribe = (state, {msg}) => {
  return state.merge({
    subscribes: Immutable(state.subscribes).set(msg.from, msg)
  }, {deep: true})
};

export const removeSubscribe = (state, {name}) => {
  let subs = state.subscribes.asMutable();
  delete subs[name];
  return state.merge({
    subscribes: Immutable(subs)
  })
};


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SUBSCRIBE]: subscribe,
  [Types.REMOVE_SUBSCRIBE]: removeSubscribe,
});

/* ------------- Selectors ------------- */

// Is the current user logged in?
// export const isLoggedIn = (loginState: Object) => loginState.username !== null

/** Constants: Connection Status Constants
 *  Connection status constants for use by the connection handler
 *  callback.
 *
 *  Status.ERROR - An error has occurred
 *  Status.CONNECTING - The connection is currently being made
 *  Status.CONNFAIL - The connection attempt failed
 *  Status.AUTHENTICATING - The connection is authenticating
 *  Status.AUTHFAIL - The authentication attempt failed
 *  Status.CONNECTED - The connection has succeeded
 *  Status.DISCONNECTED - The connection has been terminated
 *  Status.DISCONNECTING - The connection is currently being terminated
 *  Status.ATTACHED - The connection has been attached
 *  Status.CONNTIMEOUT - The connection has timed out
 */
