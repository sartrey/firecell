import React, {Component} from 'react'
import QRCode from 'qrcode.react'

import Modal from '../../component/Modal'

function autoUnit(size, fixed) {
  var units = ['B', 'KB', 'MB', 'GB', 'TB']
  var depth = 0
  while (size > 1024) {
    size = size / 1024
    depth ++
  }
  return size.toFixed(fixed) + units[depth]
}

export default class ModalFileInfo extends Component {
  constructor(props) {
    super(props)
  }

  openShell(file) {
    fetch('/__/api/openShell?path=' + file.path)
    .then(response => response.json())
    .then(json => {
      console.log(json)
    })
  }

  render() {
    var { file } = this.props
    var config = window.epii.model.config
    var weburl = `http://${config.host.ipv4[0]}:${config.port}/${file.name}`
    return (
      <Modal name='file-info' title='file info' onClose={this.props.onClose}>
        <div className='qrcode'>
          <QRCode value={weburl} size={180} level='M' />
        </div>
        <div className='detail'>
          <p>{file.name}</p>
          <p>{autoUnit(file.size, 2)}</p>
          <a onClick={e => this.openShell(file)}>{file.path}</a>
          <a href={weburl} target='_blank'>{weburl}</a>
        </div>
      </Modal>
    )
  }
}

ModalFileInfo.propTypes = {
  file: React.PropTypes.object,
  onClose: React.PropTypes.func
}
