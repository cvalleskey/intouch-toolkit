import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import Document from 'sketch/dom'
import Settings from 'sketch/settings'

export default function () {

  const browserWindow = new BrowserWindow({
    identifier: 'intouch-toolkit.webview.layout',
    width: 300,
    height: 180,
    show: false,
    title: 'Layout'
  })

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show();
  })

  const webContents = browserWindow.webContents;
  webContents.on('layout', s => {});

  browserWindow.loadURL(require('../resources/layout.html'))
}

function setLayout(size) {

  var document = Document.getSelectedDocument();
  let page = document.selectedPage;
  var selection = document.selectedLayers;
  var selected = (selection.length == 1)? selection.layers[0] : false;

  if(selection.length == 1) {
    // single layer selected, lets create the base grid and then hook up to it and edit it
  } else if(selection.length >= 1) {
    // multiple layers selected
  } else {
    // no layers selected
  }

}
