// @flow
import {StyleSheet, Platform} from 'react-native'
import {Colors} from '../../Themes/'

export default {
  container: {
    flex: 1
  },
  navBar: {
    backgroundColor: Colors.background
  },
  title: {
    color: Colors.snow
  },
  leftButton: {
    tintColor: Colors.snow
  },
  rightButton: {
    color: Colors.snow
  },
  tabBarStyle: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#b7b7b7',
    backgroundColor: Colors.white1,
    justifyContent: 'center',
    opacity: 1,
    height: 50,
  }
}
