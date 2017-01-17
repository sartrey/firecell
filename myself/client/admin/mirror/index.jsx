import React, {Component} from 'react'
import 'whatwg-fetch'

import Layout from '../component/frame/Layout'
import ModalFetchFile from './component/ModalFetchFile'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      modal: null
    }
  }

  componentDidMount() {
    fetch('/__/api/getFileList').then(response => response.json())
    .then(json => {
      if (json.state) {
        console.log(json.model)
        this.setState({ files: json.model })
      }
    })
  }

  addFileItem(item) {
    var { files } = this.state
    fetch(`/__/api/addFileItem?path=${item.path}&link=${item.link}`)
    .then(response => response.json())
    .then(json => {
      if (json.state) {
        files.push(item)
        this.setState({ files, modal: null })
      } else {
        this.setState({ modal: null })
      }
    })
  }

  openModal(name) {
    this.setState({ modal: name })
  }

  closeModal() {
    this.setState({ modal: null })
  }

  renderPanel() {
    var { modal } = this.state
    return (
      <div className='file-more'>
        <a className='btn btn-lg' onClick={e => this.openModal('fetch-file')}>fetch file</a>
        { modal === 'fetch-file' && (
          <ModalFetchFile onClose={e => this.closeModal()} onChange={e => this.addFileItem(e)} />
        ) }
        <a className='btn btn-lg' onClick={e => this.openModal('scan-local')}>scan local</a>
        <a className='btn btn-lg' onClick={e => this.openModal('scan-remote')}>scan remote</a>
      </div>
    )
  }

  renderFiles() {
    var { files } = this.state
    return (
      <div>
        <ul className='file-list'>
          {files.map((file, i) => (
            <li className='file-item' key={i}>
              <div className='record'>
                {file.path} | {file.link}
              </div>
              <div className='action'>
                <a className='btn'>
                  <i className='md-icons'>launch</i>
                </a>
                <a className='btn'>
                  <i className='md-icons'>file_download</i>
                </a>
                <a className='btn'>
                  <i className='md-icons'>delete</i>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    var { files } = this.state
    return (
      <Layout>
        {this.renderPanel()}
        {this.renderFiles()}
      </Layout>
    )
  }
}
