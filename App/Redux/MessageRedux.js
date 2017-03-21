import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'
import WebIM from '../Lib/WebIM'

/* ------------- Types and Action Creators ------------- */

const msgTpl = {
  base: {
    error: false,
    errorCode: '',
    errorText: '',
    // status default as sent if leave empty
    status: 'sending', // [sending, sent ,fail, read]
    id: '',
    // from cannot be deleted, it determines group id
    from: '',
    to: '',
    toJid: '',
    time: '',
    type: '', // chat / groupchat
    body: {},
    ext: {},
    bySelf: false,
  },
  txt: {
    type: 'txt',
    msg: ''
  },
  img: {
    type: 'img',
    file_length: 0,
    filename: '',
    filetype: '',
    length: 0,
    secret: '',
    width: 0,
    height: 0,
    url: '',
    thumb: '',
    thumb_secret: ''
  }
};

// uniform message format: client-side
function parseFromLocal(type, to, message = {}, bodyType) {
  let ext = message.ext || {};
  let obj = copy(message, msgTpl.base);
  let body = copy(message, msgTpl[bodyType]);
  return {
    ...obj,
    type,
    to,
    id: WebIM.conn.getUniqueId(),
    body: {
      ...body, ...ext, type: bodyType
    }
  }
}

// uniform message format: server-side
function parseFromServer(message = {}, bodyType) {
  let ext = message.ext || {};
  let obj = copy(message, msgTpl.base);
  // body includes, all the messages are live body, separated from base
  // body includes ext attribute for self-defined properties. ex, picture resolution.
  let body = copy(message, msgTpl[bodyType]);
  switch (bodyType) {
    case 'txt':
      return {
        ...obj, status: 'sent',
        body: {
          ...body, ...ext, msg: message.data, type: 'txt',
        }
      };
      break;
    case 'img':
      return {
        ...obj, status: 'sent',
        body: {
          ...body, ...ext, type: 'img'
        }
      };
      break;
  }
}

function copy(message, tpl) {
  let obj = {};
  Object.keys(tpl).forEach((v) => {
    obj[v] = message[v] || tpl[v]
  });
  return obj
}

const {Types, Creators} = createActions({
  addMessage: ['message', 'bodyType'],
  updateMessageStatus: ['message', 'status'],
  // ---------------async------------------
  sendTxtMessage: (chatType, chatId, message = {}) => {
    return (dispatch, getState) => {
      const pMessage = parseFromLocal(chatType, chatId, message, 'txt')
      const {body, id, to} = pMessage
      const {type, msg} = body
      const msgObj = new WebIM.message(type, id);
      console.log(pMessage)
      msgObj.set({
        //TODO: cate type == 'chatrooms'
        msg, to, roomType: false,
        success: function () {
          dispatch(Creators.updateMessageStatus(pMessage, 'sent'))
        },
        fail: function () {
          dispatch(Creators.updateMessageStatus(pMessage, 'fail'))
        }
      });

      // TODO: update group chat logic
      // if (type !== 'chat') {
      //   msgObj.setGroup('groupchat');
      // }

      WebIM.conn.send(msgObj.body);
      dispatch(Creators.addMessage(pMessage, type))
    }
  },
  sendImgMessage: (chatType, chatId, message = {}, source = {}) => {
    return (dispatch, getState) => {
      let pMessage = null;
      const id = WebIM.conn.getUniqueId();
      const type = 'img';
      const to = chatId;
      const msgObj = new WebIM.message(type, id);
      msgObj.set({
        apiUrl: WebIM.config.apiURL,
        ext: {
          file_length: source.fileSize,
          filename: source.fileName || '',
          filetype: source.fileName && (source.fileName.split('.')).pop(),
          width: source.width,
          height: source.height,
        },
        file: {
          data: {
            uri: source.uri, type: 'application/octet-stream', name: source.fileName
          }
        },
        to, roomType: '',
        onFileUploadError: function (error) {
          console.log(error);
          dispatch(Creators.updateMessageStatus(pMessage, 'fail'))
        },
        onFileUploadComplete: function (data) {
          console.log(data);
          url = data.uri + '/' + data.entities[0].uuid;
          dispatch(Creators.updateMessageStatus(pMessage, 'sent'))
        },
        success: function (id) {
          console.log(id)
        },
      });

      // TODO: update group chat logic
      // if (type !== 'chat') {
      //   msgObj.setGroup('groupchat');
      // }

      WebIM.conn.send(msgObj.body);
      pMessage = parseFromLocal(chatType, chatId, msgObj.body, 'img');
      // uri only stored in client
      pMessage.body.uri = source.uri;
      // console.log('pMessage', pMessage, pMessage.body.uri)
      dispatch(Creators.addMessage(pMessage, type))
    }
  },
});

export const MessageTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  byId: {},
  chat: {},
  groupChat: {},
  extra: {}
})

/* ------------- Reducers ------------- */
/**
 * add message
 * @param state
 * @param message object `{data,error,errorCode,errorText,ext:{weichat:{originType:webim}},from,id,to,type}`
 * @param bodyType enum [txt]
 * @returns {*}
 */
export const addMessage = (state, {message, bodyType = 'txt'}) => {
  !message.status && (message = parseFromServer(message, bodyType))
  const {username = ''} = state.user || {}
  const {type, id, to, status} = message
  // info source: if the field from is empty, then assume message is sent by current user
  const from = message.from || username
  // current user: mark as send by self
  const bySelf = from == username
  // group or chat room id: sent by self or not one-to-one chat, then it's receiver's ID or sender's ID
  const chatId = bySelf || type !== 'chat' ? to : from
  state = state.setIn(['byId', id], {
    ...message,
    bySelf,
    time: +new Date(),
    status: status,
  })
  const chatData = state[type] && state[type][chatId] ? state[type][chatId].asMutable() : []
  chatData.push(id)

  state = state
    .setIn([type, chatId], chatData)
  return state
}

/**
 * updateMessageStatus update message status
 * @param state
 * @param message object
 * @param status enum [sending, sent ,fail]
 * @returns {*}
 */
export const updateMessageStatus = (state, {message, status = ''}) => {
  const {id} = message

  return state
    .setIn(['byId', id, 'status'], status)
    .setIn(['byId', id, 'time'], +new Date())
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_MESSAGE]: addMessage,
  [Types.UPDATE_MESSAGE_STATUS]: updateMessageStatus,
})

/* ------------- Selectors ------------- */
