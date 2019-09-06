import UI from "sketch/ui";
import Document from "sketch/dom";

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;
let page = document.selectedPage;

var settings = {
  scale: 0.625
};

export function updateFormattedTextStyle() {

  var count = 0;
  var layerCount = 0;

  document.selectedLayers.forEach(function(layer) {

    if(layer.type == "Text") {

      let sharedStyle = getSharedStyleById(layer.sharedStyleId);

      if (sharedStyle) {

        // Update Shared Text Style with new properties
        syncTextStyles(sharedStyle, layer);

        // Get all layers which use the Shared Text Style
        var formattedLayers = getSharedStyleLayersById(layer.sharedStyleId);

        // Update all text layers that use this shared style
        var allLayersWithSharedStyle = getAllLayersWithSharedStyle(sharedStyle);
        for(var i = 0; i < allLayersWithSharedStyle.length; i++) {
          var layer = allLayersWithSharedStyle[i];

          // Apply new shared style to all formatted layers and apply formatting
          //layer.style.syncWithSharedStyle(sharedStyle);
          syncTextStyles(layer, sharedStyle);
        }

        // Update text styles with formatting saved
        for (var i = 0; i < formattedLayers.length; i++) {
          var layer = formattedLayers[i].layer;

          // Apply new shared style to all formatted layers and apply formatting
          //layer.style.syncWithSharedStyle(sharedStyle);
          syncTextStyles(layer, sharedStyle);

          // Edit all text layers in array with updated baselineOffsets
          applyBaselineOffset(formattedLayers[i]);
        }
        layerCount += formattedLayers.length;
        count++;
      }
    }
  });
  UI.message(count + ' selected text style' + (count==1? '':'s') + ' and ' + layerCount + ' layer' + (layerCount==1? '':'s') + ' synced');
}

export function syncLibraryTextStyles() {

  document.sharedTextStyles.forEach(function(sharedStyle, i) {

    // Get all layers using the shared style
    var layers = sharedStyle.getAllInstancesLayers();

    // Build a list of text layers with formatting to re-apply
    var textLayersToUpdateAfterSync = [];
    layers.forEach(function(layer, i) {
      textLayersToUpdateAfterSync.push(getTextFormatting(layer));
    });

    // Sync library style with local style
    sharedStyle.syncWithLibrary();

    // var copiedSharedStyle = {
    //   style : sharedStyle.style
    // }

    // Update formatting on affected text layers
    textLayersToUpdateAfterSync.forEach(function(layer) {
      setLayerBaselineOffsets(layer);
    });

  });

  UI.message(document.sharedTextStyles.length + ' library styles synced');

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

function getAllLayersWithSharedStyle(sharedStyle) {
  var sharedTextStyles = document.sharedTextStyles;
  for (var i = 0; i < sharedTextStyles.length; i++) {
    if (sharedTextStyles[i].id == sharedStyle.id) {
      return sharedTextStyles[i].getAllInstancesLayers();
    }
  }
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

function getTextFormatting(layer) {

  let textView = layer.sketchObject.attributedStringValue().treeAsDictionary();

  var textViewObj = {
    layer: layer,
    baselineOffsets: [],
    textColor: layer.style.textColor,
    alignment: layer.style.alignment
  }

  textView.attributes.forEach(function(attr) {
    var baselineOffset = attr["NSBaselineOffset"];
    if (baselineOffset != null && baselineOffset != 0) {

      textViewObj.baselineOffsets.push({
        type: baselineOffset < 0 ? "subscript" : "superscript",
        location: attr["location"],
        length: attr["length"],
      });
    }
  });
  return textViewObj;
}

function setLayerBaselineOffsets(obj) {

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

  // Reset layer's text alignment and color
  layer.style.alignment = obj.alignment;
  layer.style.textColor = obj.textColor;

}

function syncTextStyles(toLayer, fromLayer) {

  // log('from:')
  // log(fromLayer.style.fontFamily)
  //
  // log('to:')
  // log(toLayer.style.fontFamily)

  toLayer.style.fontFamily = fromLayer.style.fontFamily;
  toLayer.style.fontWeight = fromLayer.style.fontWeight;
  toLayer.style.fontSize = fromLayer.style.fontSize;
  toLayer.style.fontStyle = fromLayer.style.fontStyle;
  toLayer.style.fontVariant = fromLayer.style.fontVariant;
  //toLayer.style.textColor = fromLayer.style.textColor;

  // Note:
  // The order of these styles being applied matters. If you try to do paragraph
  // spacing afterwards, it applies it to every single line as a glitch.
  toLayer.style.paragraphSpacing = fromLayer.style.paragraphSpacing;
  toLayer.style.lineHeight = fromLayer.style.lineHeight;
}
