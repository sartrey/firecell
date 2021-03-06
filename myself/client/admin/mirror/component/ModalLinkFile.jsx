import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Modal from '../../component/Modal'

export default class ModalLinkFile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null
    }
  }

  submitChange() {
    var output = {
      path: this.refs.path.value,
      link: this.refs.link.value
    }
    this.setState({ error: null })
    if (!output.path) {
      return this.setState({ error: 'local path cannot be empty'})
    }
    if (!output.link) {
      return this.setState({ error: 'remote source cannot be empty' })
    }
    if (this.props.onChange) {
      this.props.onChange(output)
    }
  }

  renderFooter() {
    return (
      <div className='btn-group'>
        <a className='btn btn-lg' onClick={e => this.submitChange()}>
          <i className='md-icons md-icons-lg'>done</i>
        </a>
      </div>
    )
  }

  render() {
    var { error } = this.state
    return (
      <Modal name='link-file' title='link file' footer={this.renderFooter()}
        onClose={this.props.onClose}>
        { error && (
          <div className='text-halt'>{error}</div>
        ) }
        <div className='form'>
          <div className='field'>
            <input type='text' ref='path' placeholder='local path' />
          </div>
          <div className='field'>
            <input type='text' ref='link' placeholder='remote source' />
          </div>
        </div>
      </Modal>
    )
  }
}

ModalLinkFile.propTypes = {
  onClose: PropTypes.func,
  onChange: PropTypes.func
}
