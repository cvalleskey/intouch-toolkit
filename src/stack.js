/*--------------------------------------------*\

Stack
=====

Maintain space between layers in a group.

\*--------------------------------------------*/

import Sketch from 'sketch'
import UI from 'sketch/ui'
import Document from 'sketch/dom'
import Settings from 'sketch/settings'

var settings = {
  key: 'ids-stack',
  space: [ 0, 4, 8, 12, 16, 20, 24, 32, 48, 64, 96, 128, 256, 512 ]
}

export default function (context) {
  var document = Document.getSelectedDocument();
  document.selectedLayers.forEach(layer => {
    if(layer.type == "Group") {
      update(layer)
    } else if(layer.parent.type == "Group") {
      update(layer.parent)
    }
  });
}

export function applyStack(context) {
  var document = Document.getSelectedDocument();
  document.selectedLayers.forEach(layer => {
    if(layer.type == "Group") {
      Settings.setLayerSettingForKey(layer, settings.key, {
        space: settings.space[6]
      });
      layer.name = "Stack [" + settings.space[6] + "]";
      update(layer);
    }
  });
}

function update(layer) {
  var data = Settings.layerSettingForKey(layer, settings.key);

  // To-do: Sort layers by Y position, then apply stacking
  //var layers = {...layer.layers}.sort((a,b) => (a.frame.y > b.frame.y)? 1 : -1);
  //var layers = JSON.parse(JSON.stringify(layer.layers))
  var layers = layer.layers;
  //layers.sort((a,b) => (a.frame.y > b.frame.y)? 1 : -1);

  if(data && layer.type == "Group") {
      var prevLayer = { frame: { y: 0, height: 0 }};
      layers.forEach((layer, index) => {
        layer.frame.y = prevLayer.frame.y + prevLayer.frame.height + (index? data.space : 0);
        prevLayer = layer;
      });
      layer.adjustToFit();
  }
  // Recursive
  // if(layer.parent.type == "Group") {
  //   applyStack(layer.parent);
  // }
}
