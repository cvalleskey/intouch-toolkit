import UI from "sketch/ui";
import Document from "sketch/dom";

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;
let page = document.selectedPage;

var settings = {
  scale: 0.625
};

export function updateFormattedTextStyle() {
  let textLayer = document.selectedLayers.layers[0];
  let sharedStyle = getSharedStyleById(textLayer.sharedStyleId);

  if (sharedStyle) {
    // Get all layers which use the Shared Text Style
    var formattedLayers = getSharedStyleLayersById(textLayer.sharedStyleId);

    // Update Shared Text Style with new properties
    sharedStyle.style.fontFamily = textLayer.style.fontFamily;
    sharedStyle.style.fontWeight = textLayer.style.fontWeight;
    sharedStyle.style.fontSize = textLayer.style.fontSize;
    sharedStyle.style.fontStyle = textLayer.style.fontStyle;
    sharedStyle.style.fontVariant = textLayer.style.fontVariant;
    sharedStyle.style.textColor = textLayer.style.textColor;

    for (var i = 0; i < formattedLayers.length; i++) {
      var layer = formattedLayers[i].layer;

      // Apply new shared style to all formatted layers and apply formatting
      layer.style.syncWithSharedStyle(sharedStyle);

      // Edit all text layers in array with updated baselineOffsets
      applyBaselineOffset(formattedLayers[i]);
    }
  }
}

function getSharedStyleById(sharedStyleId) {
  var sharedTextStyles = document.sharedTextStyles;
  for (var i = 0; i < sharedTextStyles.length; i++) {
    if (sharedTextStyles[i].id == sharedStyleId) {
      return sharedTextStyles[i];
    }
  }
  return false;
}

function getSharedStyleLayersById(sharedStyleId) {
  var sharedTextStyles = document.sharedTextStyles;

  for (var i = 0; i < sharedTextStyles.length; i++) {
    if (sharedTextStyles[i].id == sharedStyleId) {

      var instances = sharedTextStyles[i].getAllInstancesLayers();

      var baselineOffsetTextLayers = [];

      for (var z = 0; z < instances.length; z++) {
        var layer = instances[z];

        let textView = layer.sketchObject.attributedStringValue().treeAsDictionary();

        var textViewObj = {
          layer: layer,
          //id: layer.id,
          baselineOffsets: []
        }

        textView.attributes.forEach(function(attr) {
          var baselineOffset = attr["NSBaselineOffset"];
          if (baselineOffset != null && baselineOffset != 0) {

            textViewObj.baselineOffsets.push({
              //baselineOffset: baselineOffset,
              type: baselineOffset < 0 ? "subscript" : "superscript",
              location: attr["location"],
              length: attr["length"],
              //text: attr["text"]
            });
          }
        });
        baselineOffsetTextLayers.push(textViewObj);
      }

      return baselineOffsetTextLayers;
    }
  }
}

function applyBaselineOffset(obj) {

  let layer = obj.layer;
  let object = layer.sketchObject;

  let fontSize = layer.style.fontSize;
  let baseFont = object.font();


  obj.baselineOffsets.forEach(function(baselineOffset) {

    var range = NSMakeRange(baselineOffset.location, baselineOffset.length);

    var baselineOffsetValue = getBaselineOffsetValue(baselineOffset.type, fontSize, settings.scale);
    let smallerFont = NSFontManager.sharedFontManager().convertFont_toSize(baseFont, fontSize * settings.scale);

    object.addAttribute_value_forRange(NSFontAttributeName, smallerFont, range);
    object.addAttribute_value_forRange(NSBaselineOffsetAttributeName, baselineOffsetValue, range);
  });

}

function getBaselineOffsetValue(type, fontSize, scale) {
  if (type == "superscript") {
    return Math.floor(fontSize - fontSize * scale);
  } else if (type == "subscript") {
    return Math.floor(-0.375 * (fontSize - fontSize * scale));
  }
}
