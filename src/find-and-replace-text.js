/*--------------------------------------------*\

Find and Replace
================

Basic full text find and replace

To-do:
- Regular expressions
- Nested Symbols

\*-------------------------------------------*/

import Sketch from 'sketch'
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
  "scale" : 0.625,
  "scope" : 'global' // 'global' | 'page' | 'artboard' | 'selection'
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
    browserWindow.show();
  });

  const webContents = browserWindow.webContents
  webContents.on('replaceText', s => {
    replaceText(s.findText, s.replaceText);
    getWebview(webviewIdentifier).close();
  });

  browserWindow.loadURL(require('../resources/find-and-replace-text.html'))
}

export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}

function replaceText(findText, replaceText, scope) {

  let document = Document.getSelectedDocument();
  let selectedLayers = document.selectedLayers;
  let page = document.selectedPage;
  let count = 0;

  checkLayers(selectedLayers);
  // document.pages.forEach((page, i) => {
  //   checkLayers(page.layers);
  //   UI.message(count + " layer" + (count == 1? 's': '') + " modified.");
  // });

  // var layer = context.selection[0];
  // console.log('selected')
  // console.log(layer.attributedString().treeAsDictionary().value);

  function checkLayers(layers) {
    layers.forEach((layer) => {
      if(layer.layers) {
        checkLayers(layer.layers);
      }
      if(layer.type == 'Text') {
        //console.log('Text: ' + layer.name);
        //console.log(layer);

        // 1. Get JSON of full attributes
        // 2. Find and replace throughout
        // 3. Rebuild attributedString
        // 4. Rebuild layer

        var textAttributes = layer.sketchObject.attributedStringValue().treeAsDictionary().attributes;
        console.log('textAttributes')
        console.log(textAttributes)

        textAttributes.forEach((str) => {
          var text = str.text;
          if(text.indexOf(findText) >= 0) {
            var newText = text.replace(findText, replaceText);
            console.log('old text: ' + text);
            console.log('new text: ' + newText);
            //str.text = newText;
            //console.log('found one here: ' + text.indexOf(findText))
            //layer.sketchObject.
          }
        });

      } else if(layer.type == 'SymbolInstance' && 0) {
        //console.log('SymbolInstance: ' + layer.name);
        //console.log(layer);
        layer.overrides.forEach((override) => {
          if(!override.isDefault) {
            override.value = override.value.replace(findText, replaceText);
          }
        })
      //} else if(layer.type == 'SymbolMaster') {
        //console.log('SymbolMaster: ' + layer.name);
        //console.log(layer);
      }
    });
  }
}
