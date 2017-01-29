import React, {Component} from 'react'
import 'whatwg-fetch'

import Layout from '../component/frame/Layout'
import ModalFileInfo from './component/ModalFileInfo'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      modal: null
    }
  }

  componentDidMount() {
    this.accessDir()
  }

  accessDir(path) {
    var apiPath = '/__/api/getDirectFiles'
    if (path) apiPath += `?path=${path}`
    fetch(apiPath).then(response => response.json())
    .then(json => {
      if (json.state) {
        this.setState({ files: json.model })
      }
    })
  }

  openModal(name, data) {
    this.setState({ modal: { name, data } })
  }

  closeModal() {
    this.setState({ modal: null })
  }

  renderBlock(title, items) {
    return (
      <div className='panel'>
        <div className='title'>{title}</div>
        <ul className='file-list'>{items}</ul>
      </div>
    )
  }

  renderFiles() {
    var { modal, files } = this.state
    var fileItems = files.filter(file => file.type === 'file')
    var directoryItems = files.filter(file => file.type === 'directory')
    var otherItems = files.filter(file => file.type === 'other')
    return (
      <div>
        {this.renderBlock(
          'quick',
          ['..', '/', '~'].map((path, i) => (
            <li className='file-item' key={i}>
              <a onClick={e => this.accessDir(path)}>{path}</a>
            </li>
          ))
        )}
        {this.renderBlock(
          `file / ${fileItems.length}`,
          fileItems.map((file, i) => (
            <li className='file-item' key={i}>
              <a onClick={e => this.openModal('file-info', file)}>{file.name}</a>
            </li>
          ))
        )}
        {this.renderBlock(
          `directory / ${directoryItems.length}`,
          directoryItems.map((file, i) => (
            <li className='file-item' key={i}>
              <a onClick={e => this.accessDir(file.name)}>{file.name}</a>
            </li>
          ))
        )}
        {this.renderBlock(
          `other / ${otherItems.length}`,
          otherItems.map((file, i) => (
            <li className='file-item' key={i}>
              <a>{file.name}</a>
            </li>
          ))
        )}
        { modal && modal.name === 'file-info' && (
          <ModalFileInfo file={modal.data} onClose={e => this.closeModal()} />
        ) }
      </div>
    )
  }

  render() {
    var { modal, files } = this.state
    return (
      <Layout>
        {this.renderFiles()}
      </Layout>
    )
  }
}
