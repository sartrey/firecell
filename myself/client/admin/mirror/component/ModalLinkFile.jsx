import React, {Component} from 'react'
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
      return this.setState({ error: 'path cannot be empty'})
    }
    if (!output.link) {
      return this.setState({ error: 'link cannot be empty' })
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
            <input type='text' ref='path' placeholder='target path' />
          </div>
          <div className='field'>
            <input type='text' ref='link' placeholder='source link' />
          </div>
        </div>
      </Modal>
    )
  }
}

ModalLinkFile.propTypes = {
  onClose: React.PropTypes.func,
  onChange: React.PropTypes.func
}
