import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import Document from 'sketch/dom'
import Group from 'sketch/group'
import Settings from 'sketch/settings'
import Track from "sketch-module-google-analytics"

var document = sketch.getSelectedDocument();
var selectedLayers = document.selectedLayers;
var selectedCount = selectedLayers.length;

var frames = 30;
var from = 0;
var to = 85;

if (selectedCount === 0) {
  console.log('No layers are selected.')
} else {
  console.log('Selected layers:');
  var group = new Group({
    name: 'frame-0',
    layers: selectedLayers.layers[0].layers,
    parent: selectedLayers.layers[0]
  });

  for(var num = 1; num <= frames; num++) {
    var duplicatedLayer = group.duplicate()
    duplicatedLayer.name = 'frame-' + num;
    duplicatedLayer.frame.x = selectedLayers.layers[0].frame.width * num;
    duplicatedLayer.layers.forEach(function(child, i) {
      if(child.name == "blood") {
        var eased = EasingFunctions['linear']((num / frames));
        child.frame.y += eased * to;
    }
  })
  }
  selectedLayers.layers[0].adjustToFit();
}

EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}
