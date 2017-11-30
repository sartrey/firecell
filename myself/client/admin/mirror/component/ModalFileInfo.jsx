import React, {Component} from 'react'
import QRCode from 'qrcode.react'
import Modal from '../../component/Modal'

function autoUnit(size) {
  var units = ['B', 'KB', 'MB', 'GB', 'TB']
  var depth = 0
  while (size > 1024) {
    size = size / 1024
    depth ++
  }
  return { size, unit: units[depth] }
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
    var weburl = `http://${config.host.ipv4[0]}:${config.port}${file.path}`
    var sizeof = autoUnit(file.size)
    return (
      <Modal name='file-info' title='file info' onClose={this.props.onClose}>
        <div className='qrcode'>
          <QRCode value={weburl} size={180} level='M' />
        </div>
        <div className='detail'>
          <div className='detail-header'>
            <p>{file.path}</p>
          </div>
          <div className='detail-action'>
            <p>
              <i>local</i><br />
              <a onClick={e => this.openShell(file)}>{file.real}</a>
            </p>
            <p>
              <i>remote</i><br />
              <a href={weburl} target='_blank'>{weburl}</a>
            </p>
          </div>
          <div className='detail-footer'>
            <p>{file.type === 'null' ? '(local copy not found)' : (sizeof.size.toFixed(2) + ' ' + sizeof.unit)}</p>
          </div>
        </div>
      </Modal>
    )
  }
}

ModalFileInfo.propTypes = {
  file: React.PropTypes.object,
  onClose: React.PropTypes.func
}
