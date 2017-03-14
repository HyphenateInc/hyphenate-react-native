import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {
  RefreshControl,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  TabBarIOS,
  StyleSheet,
  ScrollView,
  ListView,
  StatusBar,
  Image,
  RecyclerViewBackedScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native'

// custom
import Styles from './Styles/BaseListViewStyle'
import {Images, Colors, Metrics} from '../Themes'

class BaseListView extends Component {

  // ------------ init -------------

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    const {data = [], search} =  this.props;

    this.state = {
      isRefreshing: false,
      ds,
      dataSource: ds.cloneWithRowsAndSections(data)
    }
  }

  // ------------ logic  ---------------

  updateList(props) {
    //TODO: compare prev and next, search sorting
    const {data = [], search} = props || this.props;
    this.setState({
      dataSource: this.state.ds.cloneWithRowsAndSections(data)
    })
  }

  // ------------ lifecycle ------------

  componentDidMount() {
    // this.updateList()
  }

  componentWillReceiveProps(nextProps) {
    this.updateList(nextProps)
  }

  componentDidUpdate() {
    const {autoScroll} = this.props;

    if (autoScroll && "listHeight" in this.state &&
      "footerY" in this.state &&
      this.state.footerY > this.state.listHeight) {
      let scrollDistance = this.state.listHeight - this.state.footerY;
      this.refs.list.getScrollResponder().scrollTo({y: -scrollDistance, animated: true});
    }
  }

  // ------------ handlers -------------

  handleRefresh() {
    const {handleRefresh} = this.props;

    this.setState({isRefreshing: true});
    handleRefresh();
    // TODO: refresh succeed/failed
    setTimeout(() => {
      this.setState({isRefreshing: false})
    }, 1000)
  }

  // ------------ renders -------------

  _renderRow(rowData, sectionId, rowID, highlightRow) {
    return (
      <TouchableOpacity onPress={() => {
        {/*NavigationActions.contactInfo({"uid": rowData})*/
        }
      }}>
        <View style={Styles.row}>
          <Image source={Images.default} resizeMode='cover' style={Styles.rowLogo}/>
          <View style={Styles.rowName}>
            <Text>{rowData}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={Styles.separator}
      />
    )
  }

  render() {
    const {hasNav, renderRow, renderSeparator, listViewStyle, autoScroll = false} = this.props

    const containerStyle = [Styles.container]
    // hasNav && containerStyle.push({marginTop: Metrics.navBarHeight})
    const listStyle = [Styles.listView]
    listViewStyle && listStyle.push(listViewStyle)

    return (
      <View style={containerStyle}>
        <ListView
          ref="list"
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.handleRefresh.bind(this)}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
          }
          automaticallyAdjustContentInsets={false}
          initialListSize={10}
          enableEmptySections={true}
          style={listStyle}
          dataSource={this.state.dataSource}
          renderRow={renderRow || this._renderRow.bind(this)}
          renderSeparator={renderSeparator || this._renderSeparator.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          onLayout={(event) => {
            this.setState({
              listHeight: event.nativeEvent.layout.height
            })
          }}
          renderFooter={() => {
            return (<View onLayout={(event) => {
              this.setState({
                footerY: event.nativeEvent.layout.y
              })
            }}/>)
          }}
        />
      </View>
    )
  }
}


BaseListView.propTypes = {
  hasNav: PropTypes.bool,
  data: PropTypes.object,
  search: PropTypes.string,
  handleRefresh: PropTypes.func,
  renderRow: PropTypes.func,
  renderSeparator: PropTypes.func,
}

export default BaseListView


