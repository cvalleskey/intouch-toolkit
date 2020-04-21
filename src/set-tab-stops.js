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

  console.log('obj.tabStops')
  console.log(obj.tabStops)

  if(newTabStops == "auto") {
    // set bullet spacing based on font size and a good harmony
  }

  let document = Document.getSelectedDocument();
  let selectedLayers = document.selectedLayers;

  selectedLayers.forEach((layer) => {
    var currentTabStops = layer.sketchObject.attributedStringValue().attributeForKey("NSParagraphStyle").treeAsDictionary().style.tabStops;
    // console.log('currentTabStops')
    // console.log(currentTabStops)
    var tabIntervalArray = Object.values(newTabStops);
    tabIntervalArray.forEach((item) => { item = parseInt(item); })
    //var tabIntervalArray = [16,32,48,64,80,96,112,128,144,160,176,192,208];

    // var newTabStopsArray = [];
    // tabIntervalArray.forEach((stop, i) => {
    //   newTabStopsArray.push(NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, stop));
    // });

    var paragraphStyle = layer.sketchObject.attributedStringValue().attributeForKey("NSParagraphStyle");

    tabIntervalArray.forEach((stop, i) => {
      paragraphStyle.tabStops()[i] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, stop);
    })
    // paragraphStyle.tabStops()[0] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[0]);
    // paragraphStyle.tabStops()[1] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[1]);
    // paragraphStyle.tabStops()[2] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[2]);
    // paragraphStyle.tabStops()[3] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[3]);
    // paragraphStyle.tabStops()[4] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[4]);
    // paragraphStyle.tabStops()[5] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[5]);
    // paragraphStyle.tabStops()[6] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[6]);
    // paragraphStyle.tabStops()[7] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[7]);
    // paragraphStyle.tabStops()[8] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[8]);
    // paragraphStyle.tabStops()[9] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[9]);
    // paragraphStyle.tabStops()[10] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[10]);
    // paragraphStyle.tabStops()[11] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[11]);
    // paragraphStyle.tabStops()[12] = NSTextTab.alloc().initWithType_location(NSTextAlignmentLeft, tabIntervalArray[12]);
    paragraphStyle.headIndent = tabIntervalArray[1];

    //paragraphStyle.tabStops()[0] = newTabStopsArray[0];
    // paragraphStyle.tabStops()[1] = newTabStopsArray[1];
    // paragraphStyle.tabStops()[2] = newTabStopsArray[2];
    // paragraphStyle.tabStops()[3] = newTabStopsArray[3];
    // paragraphStyle.tabStops()[4] = newTabStopsArray[4];
    // paragraphStyle.tabStops()[5] = newTabStopsArray[5];
    // paragraphStyle.tabStops()[6] = newTabStopsArray[6];
    // paragraphStyle.tabStops()[7] = newTabStopsArray[7];
    // paragraphStyle.tabStops()[8] = newTabStopsArray[8];
    // paragraphStyle.tabStops()[9] = newTabStopsArray[9];
    // paragraphStyle.tabStops()[10] = newTabStopsArray[10];
    // paragraphStyle.tabStops()[11] = newTabStopsArray[11];
    // paragraphStyle.tabStops()[12] = newTabStopsArray[12];
    //paragraphStyle.headIndent = newTabStopsArray[1];

    console.log('final tabStops')
    console.log(paragraphStyle.tabStops())

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
