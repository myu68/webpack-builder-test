'use strict';

// import React from 'react';
// import largerNumber from '../../common/large-number.js'
// import './search.less'
// import photo from '../image/photo.jpeg'

const React = require('react')
// const ReactDOM = require('react-dom');
// const largerNumber = require('../../common/large-number.js')
require('./search.less')
const photo = require('./image/photo.jpeg')

class Search extends React.Component {
  constructor() {
    super(...arguments)

    this.state = {
      Text: null
    }
  }
  loadComponent () {
    import('./text.js').then((Text) => {
      this.setState({
        Text: Text.default
      })
    });
  }
  render () {
    // const funcA = a()
    // {funcA} 
    const { Text } = this.state
    // const addResult = largerNumber('999', '1')
    return <div class="search">
      {
        Text ? <Text /> : ''
      }
      {/* { addResult } --- */}
      Search Text<img src={photo} onClick={this.loadComponent.bind(this)} />
    </div>
  }
}

module.exports = <Search />