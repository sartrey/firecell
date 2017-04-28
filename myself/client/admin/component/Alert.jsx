import React, {Component} from 'react'

export default class Alert extends Component {
  closeAlert() {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    var { theme } = this.props
    return (
      <div className={`alert alert-${theme}`}>
        <div className='wrapper'>
          {this.props.children}
        </div>
        <a className='close' onClick={e => this.closeAlert()}>
          <i className='md-icons'>close</i>
        </a>
      </div>
    )
  }
}

Alert.propTypes = {
  theme: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func
}