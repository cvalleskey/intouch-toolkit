/*--------------------------------------------*\

Smart Resize Text
================

Adjusts font style properties based
on a defined type scale.

\*--------------------------------------------*/

import Sketch from 'sketch'
//import BrowserWindow from 'sketch-module-web-view'
//import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import Document from 'sketch/dom'
import Settings from 'sketch/settings'
// import Track from "sketch-module-google-analytics";
//const webviewIdentifier = 'intouch-toolkit.webview'

var settings = {
  round: true,
  breakpoints: [480, 688, 992, 1312],
  fontSizes: [ 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 88, 96 ],
  text: {
    display: {
      fontSize: [7,8,10,12],
      fontFamily: 'Lato',
      fontWeight: 3, // 400
      lineHeight: 1.125,
      letterSpacing: -1.25
    },
    heading: {
      fontSize: [5,6,7,9],
      fontFamily: 'Lato',
      fontWeight: 9, // 400
      lineHeight: 1.125,
      letterSpacing: -1.25
    },
    body: {
      fontSize: [2,2,3,4],
      fontFamily: 'Lato',
      fontWeight: 5, // 400
      lineHeight: 1.5,
      letterSpacing: 0
    },
  }
}

export default function (context) {
  var document = Document.getSelectedDocument();
  document.selectedLayers.forEach(layer => { setTypeStyle(layer, 'body') });
}

function setSelectedTypeStyles(style) {
  var document = Document.getSelectedDocument();
  document.selectedLayers.forEach(layer => { setTypeStyle(layer, style) });
}

function setTypeStyle(layer, style) {
  // var layerResponsiveSettings = Settings.layerSettingForKey(layer, 'ids-responsive-type');
  // if(!layerResponsiveSettings) {
    Settings.setLayerSettingForKey(layer, 'ids-responsive-type', {
      ...settings.text[style],
      step: 0
    });
    applyTypeProperties(layer);
  //}
}

function applyTypeProperties(layer) {

  var parent = layer.getParentArtboard();
  var data = Settings.layerSettingForKey(layer, 'ids-responsive-type');

  var breakpointIndex = 0;
  settings.breakpoints.forEach((width, i) => {
    if (width <= parent.frame.width) {
      breakpointIndex = i;
    }
  });

  var fontSize = settings.fontSizes[data.fontSize[breakpointIndex] + data.step];

  layer.style.fontSize = fontSize;
  layer.style.fontFamily = data.fontFamily;
  layer.style.fontWeight = data.fontWeight;
  layer.style.lineHeight = round(fontSize * data.lineHeight);
  layer.style.kerning = data.letterSpacing;

}

function step(amount) {
  var document = Document.getSelectedDocument();
  document.selectedLayers.forEach((layer, i) => {
    var data = Settings.layerSettingForKey(layer, 'ids-responsive-type');
    data.step += amount;
    Settings.setLayerSettingForKey(layer, 'ids-responsive-type', data);
    applyTypeProperties(layer);
  });

}

export function setAsDisplay() { setSelectedTypeStyles('display'); }
export function setAsHeading() { setSelectedTypeStyles('heading'); }
export function setAsBody() { setSelectedTypeStyles('body'); }

export function stepUp() { step(1); }
export function stepDown() { step(-1); }

export function onLayersResized(context) {

  var document = Document.getSelectedDocument();
  var selection = document.selectedLayers;

  var apply = function(layer) {
    var data = Settings.layerSettingForKey(layer, 'ids-responsive-type');
    if(data) { applyTypeProperties(layer); }
  }

  selection.forEach(artboard => {
    if(artboard.type == "Artboard") {

      var searchLayers = function(parent) {
        parent.layers.forEach(layer => {

          if (layer.type == "Group") {
            //console.log('this is a group so search inside')
            searchLayers(layer);
          } else if(layer.type == "Text") {
            apply(layer);
          }
        })
      };

      searchLayers(artboard);

    } else if(artboard.type == "Text") {
      apply(artboard);
    }
  })
}

const round = (num) => {
  return settings.round? Math.round(num) : num
}
