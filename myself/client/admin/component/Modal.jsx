import React, {Component} from 'react'

export default class Modal extends Component {
  closeModal() {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    var { name } = this.props
    return (
      <div className={`modal modal-${name}`}>
        <div className='wrapper'>
          <div className='header'>
            <div className='title'>{this.props.title}</div>
            <div className='right'>
              <a onClick={e => this.closeModal()}>
                <i className='md-icons md-icons-lg'>close</i>
              </a>
            </div>
          </div>
          <div className='content'>
            {this.props.children}
          </div>
          {this.props.footer && (
            <div className='footer'>
              {this.props.footer}
            </div>
          )}
        </div>
      </div>
    )
  }
}

Modal.propTypes = {
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  footer: React.PropTypes.any,
  onClose: React.PropTypes.func
}
