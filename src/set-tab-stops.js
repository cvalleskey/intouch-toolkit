/*--------------------------------------------*\

Set Tab Stops
=============

UI for setting tab stops in lists

\*-------------------------------------------*/

import Sketch from 'sketch'
import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import Document from 'sketch/dom'
import Track from "sketch-module-google-analytics";

const webviewIdentifier = 'intouch-toolkit.webview'

export default function (context) {

  let document = Document.getSelectedDocument();
  let selectedLayers = document.selectedLayers;

  const webViewOptions = {
    identifier: webviewIdentifier,
    webpage: "set-tab-stops.html",
    width: 660,
    height: 184,
    show: false,
    title: 'Set List Spacing',
    parent: Document.getSelectedDocument(),
    center: true
  }

  const browserWindow = new BrowserWindow(webViewOptions)
  browserWindow.once('ready-to-show', () => {
    browserWindow.show();

    var selectedTabStops = getSelectedLayerTabStops();

    var tabStopsArray = [];
    selectedTabStops.forEach((stop, i) => {
      tabStopsArray.push(stop);
    });

    console.log("fontSize: " + selectedLayers.layers[0].style.fontSize);

    browserWindow.webContents
      .executeJavaScript(`setValues(${JSON.stringify({
        tabStops: tabStopsArray.toString(),
        fontSize: selectedLayers.layers[0].style.fontSize
      })})`)
      .catch(error => log(error))
  });

  const webContents = browserWindow.webContents
  webContents.on('update', s => {
    //console.log('do update')
    //console.log(s)
    update(s);
    getWebview(webviewIdentifier).close();
  });

  webContents.on('nativeLog', s => log(s));

  browserWindow.loadURL(require('../resources/set-tab-stops.html'))
}

export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}

function update(obj) {

  var newTabStops = obj.tabStops;

  let document = Document.getSelectedDocument();
  let selectedLayers = document.selectedLayers;

  selectedLayers.forEach((layer) => {
    var currentTabStops = layer.sketchObject.attributedStringValue().attributeForKey("NSParagraphStyle").treeAsDictionary().style.tabStops;

    // Convert object to array and change values from strings to numbers
    var tabIntervalArray = Object.values(newTabStops);
    tabIntervalArray.forEach((item) => { item = parseInt(item); })

    // Apply the new stops to the Text layer
    var paragraphStyle = layer.sketchObject.attributedStringValue().attributeForKey("NSParagraphStyle");
    tabIntervalArray.forEach((stop, i) => {
      paragraphStyle.tabStops()[i] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, stop);
    })
    paragraphStyle.headIndent = tabIntervalArray[1];
    layer.sketchObject.adjustFrameToFit();

  });

}

function getSelectedLayerTabStops() {
  let document = Document.getSelectedDocument();
  let selectedLayers = document.selectedLayers;

  var selectedTabStops = selectedLayers.layers[0].sketchObject.attributedStringValue().attributeForKey("NSParagraphStyle").treeAsDictionary().style.tabStops;

  return selectedTabStops;
}
