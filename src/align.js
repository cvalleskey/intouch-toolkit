import UI from "sketch/ui";
import Document from "sketch/dom";

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;
let page = document.selectedPage;

export function left(context) { alignItems("left"); }
export function right(context) { alignItems("right"); }
export function horizontally(context) { alignItems("horizontally"); }
export function top(context) { alignItems("top"); }
export function bottom(context) { alignItems("bottom"); }
export function vertically(context) { alignItems("vertically"); }

function alignItems(alignment) {
  var selectedLayersArray = [];
  selectedLayers.forEach(layer => {
    var layerData = {
      layer: layer,
      frame: {
        x: layer.frame.x,
        y: layer.frame.y,
        absolute_x: layer.frame.x,
        absolute_y: layer.frame.y,
        width: layer.frame.width,
        height: layer.frame.height
      }
    };
    var getAbsoluteFrame = function(layer) {
      if (typeof layer.frame == "object") {
        layerData.frame.absolute_x += layer.frame.x;
        layerData.frame.absolute_y += layer.frame.y;
        getAbsoluteFrame(layer.parent);
      }
    };
    getAbsoluteFrame(layer.parent);
    selectedLayersArray.push(layerData);
  });

  var selectionFrame = {
    x: Math.min(...selectedLayersArray.map(layer => layer.frame.absolute_x)),
    y: Math.min(...selectedLayersArray.map(layer => layer.frame.absolute_y)),
    width:
      Math.max(...selectedLayersArray.map(layer => layer.frame.absolute_x + layer.frame.width)) -
      Math.min(...selectedLayersArray.map(layer => layer.frame.absolute_x)),
    height:
      Math.max(...selectedLayersArray.map(layer => layer.frame.absolute_y + layer.frame.height)) -
      Math.min(...selectedLayersArray.map(layer => layer.frame.absolute_y)),
  };

  switch (alignment) {
    case "top":
      var y = Math.min(...selectedLayersArray.map(layer => layer.frame.absolute_y))
      selectedLayersArray.forEach(obj => {
        obj.layer.frame.y += y - obj.frame.absolute_y;
      });
      break;
    case "bottom":
      var y = Math.max(...selectedLayersArray.map(layer => layer.frame.absolute_y + layer.frame.height))
      selectedLayersArray.forEach(obj => {
        obj.layer.frame.y += y - obj.frame.absolute_y - obj.layer.frame.height;
      });
      break;
    case "left":
      var x = Math.min(...selectedLayersArray.map(layer => layer.frame.absolute_x));
      selectedLayersArray.forEach(obj => {
        obj.layer.frame.x += x - obj.frame.absolute_x;
      });
      break;
    case "right":
      var x = Math.max(...selectedLayersArray.map(layer => layer.frame.absolute_x + layer.frame.width))
      selectedLayersArray.forEach(obj => {
        obj.layer.frame.x += x - obj.frame.absolute_x - obj.layer.frame.width;
      });
      break;
    case "horizontally":
      var x = selectionFrame.x + selectionFrame.width / 2;
      selectedLayersArray.forEach(obj => {
        obj.layer.frame.x += x - obj.frame.absolute_x - (obj.layer.frame.width / 2);
      });
      break;
    case "vertically":
      var y = selectionFrame.y + selectionFrame.height / 2;
      selectedLayersArray.forEach(obj => {
        obj.layer.frame.y += y - obj.frame.absolute_y - (obj.layer.frame.height / 2);
      });
      break;
    default:
  }
}
