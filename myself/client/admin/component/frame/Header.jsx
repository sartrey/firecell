import React, {Component} from 'react'
import 'whatwg-fetch'

export default class Header extends Component {
  constructor(props) {
    super(props)
  }

  switchMode() {
    fetch('/__/api/switchMode')
    .then(response => response.json())
    .then(json => {
      if (json.state) {
        if (this.props.onSwitch) {
          this.props.onSwitch()
        }
      }
    })
  }

  render() {
    var { mode, port, path } = this.props.config
    return (
      <header>
        <div className='logo'>firecell</div>
        <div className='mode' onClick={e => this.switchMode()}>
          <div className={mode === 'mirror' ? 'active' : null}>Mirror</div>
          <div className={mode === 'direct' ? 'active' : null}>Direct</div>
        </div>
      </header>
    )
  }
}
