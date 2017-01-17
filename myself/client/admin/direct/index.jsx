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
    fetch('/__/api/getFileList').then(response => response.json())
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

  renderFiles() {
    var { modal, files } = this.state
    return (
      <div>
        <ul className='file-list'>
          {files.map((file, i) => {
            return (
              <li className='file-item' key={i}>
                <a onClick={e => this.openModal('file-info', file)}>{file.name}</a>
              </li>
            )
          })}
        </ul>
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
