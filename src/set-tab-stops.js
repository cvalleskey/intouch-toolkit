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

  const webViewOptions = {
    identifier: webviewIdentifier,
    webpage: "set-tab-stops.html",
    width: 660,
    height: 184,
    show: false,
    title: 'Set Tab Stops',
    parent: Document.getSelectedDocument(),
    center: true
  }

  const browserWindow = new BrowserWindow(webViewOptions)
  browserWindow.once('ready-to-show', () => {
    browserWindow.show();

    var selectedTabStops = getSelectedLayerTabStops();

    console.log('toString()')
    console.log(selectedTabStops.toString())
    var tabStopsArray = [];
    selectedTabStops.forEach((stop, i) => {
      tabStopsArray.push(stop);
    });
    console.log("new tabStopsArray")
    console.log(tabStopsArray)


    browserWindow.webContents
      .executeJavaScript(`setValues(${JSON.stringify({ tabStops: tabStopsArray.toString() })})`)
      .then(res => browserWindow.show())
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

function update(tabInterval) {

  // console.log("tabInterval")
  // console.log(tabInterval)

  if(tabInterval == "auto") {
    // set bullet spacing based on font size and a good harmony
  }

  let document = Document.getSelectedDocument();
  let selectedLayers = document.selectedLayers;

  selectedLayers.layers.forEach((layer) => {
    var currentTabStops = layer.sketchObject.attributedStringValue().attributeForKey("NSParagraphStyle").treeAsDictionary().style.tabStops;

    //tabIntervalArray = Object.values(tabInterval);
    //tabIntervalArray.forEach((item) => { item = parseInt(item); })
    var tabIntervalArray = [16,32,48,64,80,96,112,128,144,160,176,192,208];

    var newTabStopsArray = [];
    tabIntervalArray.forEach((stop, i) => {
      newTabStopsArray.push(NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, stop));
    });

    //console.log("currentTabStops")
    //console.log(currentTabStops)
    //console.log(getSelectedLayerTabStops())

    //console.log("newTabStopsArray")
    //console.log(newTabStopsArray)

    var paragraphStyle = layer.sketchObject.attributedStringValue().attributeForKey("NSParagraphStyle");
    paragraphStyle.tabStops = newTabStopsArray;
    paragraphStyle.headIndent = newTabStops[1];

    console.log('final tabStops')
    console.log(paragraphStyle.tabStops)

  });

}

function getSelectedLayerTabStops() {
  let document = Document.getSelectedDocument();
  let selectedLayers = document.selectedLayers;

  //console.log("selectedLayers.layers[0].sketchObject")
  //console.log(selectedLayers.layers[0].sketchObject)

  var selectedTabStops = selectedLayers.layers[0].sketchObject.attributedStringValue().attributeForKey("NSParagraphStyle").treeAsDictionary().style.tabStops;

  console.log('selectedTabStops')
  console.log(selectedTabStops)

  return selectedTabStops;
}
