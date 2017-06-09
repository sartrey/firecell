import React, {Component} from 'react'
import 'whatwg-fetch'
import _ from 'lodash'

import Alert from '../component/Alert'
import Layout from '../component/frame/Layout'
import ModalLinkFile from './component/ModalLinkFile'
import ModalFileInfo from './component/ModalFileInfo'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      modal: null,
      tings: []
    }
  }

  componentDidMount() {
    this.getFiles()
  }

  getFiles(list) {
    var { files } = this.state
    fetch('/__/api/getMirrorFiles' + (list ? '?' + list.join(',') : ''))
    .then(response => response.json())
    .then(json => {
      if (json.state) {
        this.setState({ files: _.merge(files, json.model) })
      }
    })
  }

  addFileLink(item) {
    var { files } = this.state
    fetch(`/__/api/addFileLink?path=${item.path}&link=${item.link}`)
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

  fetchFile(item) {
    fetch(`/__/api/fetchFile?path=${item.path}&link=${item.link}`)
    .then(response => response.json())
    .then(json => {
      if (json.state) {
        this.getFiles([item.path])
        this.pushAlert('done', `file <${item.path}> downloaded`)
      } else {
        this.pushAlert('halt', `failed to download file <${item.path}>`)
      }
    })
  }

  fetchFiles() {
    var { files } = this.state
    files.forEach(file => {
      fetch(`/__/api/fetchFile?path=${file.path}&link=${file.link}`)
      .then(response => response.json())
      .then(json => {
        if (json.state) {
          this.getFiles([file.path])
          this.pushAlert('done', `file <${file.path}> downloaded`)
        } else {
          this.pushAlert('halt', `failed to download file <${file.path}>`)
        }
      })
    })
  }

  removeFile(item) {
    fetch(`/__/api/removeFile?path=${item.path}`)
    .then(response => response.json())
    .then(json => {
      if (json.state) {
        // this.getFiles([item.path])
        this.pushAlert('done', `file <${item.path}> removed`)
      } else {
        this.pushAlert('halt', `failed to download file <${item.path}>`)
      }
    })
  }

  openModal(name, data) {
    this.setState({ modal: { name, data } })
  }

  closeModal() {
    this.setState({ modal: null })
  }

  pushAlert(type, body) {
    var { tings } = this.state
    tings.push({ type, body, time: new Date() })
    this.setState({ tings })
  }

  kickAlert(item) {
    var { tings } = this.state
    var index = tings.indexOf(item)
    tings.splice(index, 1)
    this.setState({ tings })
  }

  renderPanel() {
    var { modal } = this.state
    return (
      <div className='file-more'>
        <a className='btn btn-lg' onClick={e => this.openModal('link-file')}>
          <i className='md-icons'>insert_link</i>link file
        </a>
        <a className='btn btn-lg' onClick={e => this.fetchFiles()}>
          <i className='md-icons'>sync</i>sync list
        </a>
        <a className='btn btn-lg' onClick={e => this.openModal('scan-path')}>
          <i className='md-icons'>search</i>scan path
        </a>
      </div>
    )
  }

  renderFiles() {
    var { modal, files } = this.state
    return (
      <div>
        <ul className='file-list'>
          {files.map((file, i) => (
            <li className='file-item' key={i}>
              <div className='record'>
                <span className='item-path'>{file.path}</span>
                <span className='item-link'>{file.link}</span>
              </div>
              <div className='action'>
                <a className='btn' onClick={e => this.openModal('file-info', file)}>
                  <i className='md-icons'>launch</i>
                </a>
                <a className='btn' onClick={e => this.fetchFile(file)}>
                  <i className='md-icons'>file_download</i>
                </a>
                <a className='btn' onClick={e => this.removeFile(file)}>
                  <i className='md-icons'>delete</i>
                </a>
              </div>
            </li>
          ))}
        </ul>
        { modal && modal.name === 'link-file' && (
          <ModalLinkFile onClose={e => this.closeModal()} />
        ) }
        { modal && modal.name === 'file-info' && (
          <ModalFileInfo file={modal.data} onClose={e => this.closeModal()} />
        ) }
      </div>
    )
  }

  renderAlert() {
    var { tings } = this.state
    return (
      <div className='alert-hub'>
        {tings.sort((a, b) => b.time - a.time).map((alert, i) => (
          <Alert key={i} theme={alert.type}
            onClose={e => this.kickAlert(alert)}>
            {alert.body}
          </Alert>
        ))}
      </div>
    )
  }

  render() {
    var { files } = this.state
    return (
      <Layout>
        {this.renderPanel()}
        {this.renderFiles()}
        {this.renderAlert()}
      </Layout>
    )
  }
}
