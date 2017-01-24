import React, {Component} from 'react'
import 'whatwg-fetch'

import Header from './Header'
import Footer from './Footer'

export default class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      config: {}
    }
  }

  componentDidMount() {
    this.requestConfig()
  }

  requestConfig() {
    var { config } = this.state
    fetch('/__/api/getConfig')
    .then(response => response.json())
    .then(json => {
      if (json.state) {
        var update = json.model
        if (config.mode && update.mode !== config.mode) {
          window.location.reload(true)
        } else {
          window.epii.model.config = update
          this.setState({ config: update })
        }
      }
    })
    .catch(console.error)
  }

  render() {
    var { config } = this.state
    return (
      <div className='wrapper'>
        <Header config={config} onSwitch={e => this.requestConfig()} />
        <div className='holder'>
          {this.props.children}
        </div>
        <Footer />
      </div>
    )
  }
}
