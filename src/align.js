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
  var selectedFrame = { x: 0, y: 0, width: 0, height: 0 };
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
    x: selectedLayersArray.map(layer => layer.frame.absolute_x).sort()[0],
    y: selectedLayersArray.map(layer => layer.frame.absolute_y).sort()[0],
    width:
      selectedLayersArray
        .map(layer => layer.frame.absolute_x + layer.frame.width)
        .sort()
        .reverse()[0] -
      selectedLayersArray.map(layer => layer.frame.absolute_x).sort()[0],
    height:
      selectedLayersArray
        .map(layer => layer.frame.absolute_y + layer.frame.height)
        .sort()
        .reverse()[0] -
      selectedLayersArray.map(layer => layer.frame.absolute_y).sort()[0]
  };

  switch (alignment) {
    case "top":
      var y = selectedLayersArray
        .map(layer => layer.frame.absolute_y)
        .sort()[0];
      selectedLayersArray.forEach(obj => {
        obj.layer.frame.y += y - obj.frame.absolute_y;
      });
      break;
    case "bottom":
      var y = selectedLayersArray
        .map(layer => layer.frame.absolute_y + layer.frame.height)
        .sort()
        .reverse()[0];
      selectedLayersArray.forEach(obj => {
        obj.layer.frame.y += y - obj.frame.absolute_y - obj.layer.frame.height;
      });
      break;
    case "left":
      var x = selectedLayersArray
        .map(layer => layer.frame.absolute_x)
        .sort()[0];
      selectedLayersArray.forEach(obj => {
        obj.layer.frame.x += x - obj.frame.absolute_x;
      });
      break;
    case "right":
      var x = selectedLayersArray
        .map(layer => layer.frame.absolute_x + layer.frame.width)
        .sort()
        .reverse()[0];
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
