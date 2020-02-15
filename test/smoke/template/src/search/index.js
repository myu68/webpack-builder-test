'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import largerNumber from '../../common/large-number.js'
import './search.less'
import photo from './image/photo.jpeg'
// import '../../common'
// import { a } from './tree-shaking'

// if (false) a()

class Search extends React.Component {
  constructor() {
    super(...arguments)

    this.state = {
      Text: null
    }
  }
  // 动态加载模块
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
    const addResult = largerNumber('999', '1')
    return <div class="search">
      {
        Text ? <Text /> : ''
      }
      { addResult } ---
      Search Text<img src={photo} onClick={this.loadComponent.bind(this)} />
    </div>
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
)