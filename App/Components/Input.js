// @flow

import React from 'react'
import {TextInput, TouchableWithoutFeedback, Text, View} from 'react-native'

// custom
import I18n from 'react-native-i18n'
import Styles from './Styles/InputStyle'
import {Images, Colors} from '../Themes'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Input extends React.Component {

  // ------------ init -------------
  state = {
    focused: false,
    search: ''
  };

  // ------------ logic  ---------------

  // ------------ lifecycle ------------

  // ------------ handlers -------------
  handleChangeSearch(text) {
    this.setState({search: text})
  }

  handleSelectSearch() {
    this.refs.search.focus();
    this.setState({focused: true})
  }

  handleFocusSearch() {
    this.setState({focused: true})
  }

  handleBlurSearch() {
    this.refs.search.blur();
    this.setState({focused: false})
  }

  render() {
    let {backgroundColor, placeholder, onChangeText, value, theme = 'default', iconSize, iconColor, iconName} = this.props

    let searchStyle = [
      Styles.search,
      theme == 'default' ? Styles.searchDefault : {},
      this.state.focused ? Styles.searchFocus : {},
      backgroundColor ? {backgroundColor} : {}
    ];

    let searchIconStyle = [
      Styles.searchRow,
      Styles.searchIcon,
      this.state.focused || theme == 'default' ? Styles.searchIconFocus : {},
      backgroundColor ? {backgroundColor} : {}
    ];

    let searchRow = [
      Styles.searchRow,
      backgroundColor ? {backgroundColor} : {}
    ];

    return (
      <TouchableWithoutFeedback onPress={this.handleSelectSearch.bind(this)}>
        {/* trigger the input focus event when tapping left region of search button */}
        <View style={searchStyle}>
          <View style={searchIconStyle}>
            <Icon name={iconName} size={iconSize} color={iconColor}/>
          </View>
          {/* TODO: returnKeyType */}
          <View style={searchRow}>
            <TextInput
              ref="search"
              style={Styles.searchInput}
              value={value}
              editable={true}
              keyboardType='default'
              returnKeyType='go'
              autoCapitalize='none'
              autoCorrect={false}
              onFocus={this.handleFocusSearch.bind(this)}
              onBlur={this.handleBlurSearch.bind(this)}
              onChangeText={onChangeText}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.search.focus()}
              placeholder={placeholder}
              placeholderTextColor={Colors.blueGrey}
              selectionColor={Colors.blueGrey}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

Input.propTypes = {};
