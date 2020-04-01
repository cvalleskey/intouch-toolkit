/*--------------------------------------------*\

Find and Replace
================

Basic full text find and replace

To-do:
- Regular expressions

\*-------------------------------------------*/

import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import Document from 'sketch/dom'
import Track from "sketch-module-google-analytics";

const webviewIdentifier = 'intouch-toolkit.webview'

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;
let page = document.selectedPage;

var settings = {
  "scale" : 0.625
}

export default function (context) {

  const webViewOptions = {
    identifier: webviewIdentifier,
    webpage: "find-and-replace-text.html",
    width: 480,
    height: 172,
    show: false,
    title: 'Find and Replace Text',
    parent: Document.getSelectedDocument(),
    center: true
  }

  const browserWindow = new BrowserWindow(webViewOptions)

  browserWindow.once('ready-to-show', () => {

    var document = Document.getSelectedDocument();

    browserWindow.show();
  });

  const webContents = browserWindow.webContents

  webContents.on('replaceText', s => {
    replaceText(s.findText, s.replaceText);
    getWebview(webviewIdentifier).close();
  });

  webContents.on('nativeLog', s => log(s));

  browserWindow.loadURL(require('../resources/find-and-replace-text.html'))
}

export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}

function replaceText(findText, replaceText) {
  console.log("Find: " + findText);
  console.log("Replace: " + replaceText);
}
