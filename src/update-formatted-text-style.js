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
    sharedStyle.style.fontSize = textLayer.style.fontSize;

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
      //log(sharedTextStyles[i].name);

      var instances = sharedTextStyles[i].getAllInstancesLayers();

      //log('instances: ' + instances);

      var baselineOffsetTextLayers = [];

      for (var z = 0; z < instances.length; z++) {
        var layer = instances[z];

        let textView = layer.sketchObject
          .attributedStringValue()
          .treeAsDictionary();

        textView.attributes.forEach(function(attr) {
          var baselineOffset = attr["NSBaselineOffset"];
          if (baselineOffset != null && baselineOffset != 0) {
            baselineOffsetTextLayers.push({
              layer: layer,
              id: layer.id,
              baselineOffset: baselineOffset,
              type: baselineOffset < 0 ? "subscript" : "superscript",
              location: attr["location"],
              length: attr["length"],
              text: attr["text"]
            });
          }
        });
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
  //let boldFont = NSFontManager.sharedFontManager().convertFont_toHaveTrai(baseFont, NSBoldFontMask);

  // let font = object
  //   .attributedStringValue()
  //   .attribute_atIndex_longestEffectiveRange_inRange(
  //     NSFontAttributeName,
  //     0,
  //     NSMakeRange(0, 1),
  //     NSMakeRange(0, 1)
  //   );
  //
  //   log(baseFont)

  // let descriptor = font.fontDescriptor(); //.fontDescriptorByAddingAttributes(settingsAttribute)
  // let newFont = NSFont.fontWithDescriptor_size(
  //   descriptor,
  //   fontSize * settings.scale
  // );
  // let attrsDict = NSDictionary.dictionaryWithObject_forKey(
  //   newFont,
  //   NSFontAttributeName
  // );

  if (obj.type == "superscript") {
    var baselineOffsetValue = Math.floor(fontSize - fontSize * settings.scale);
  } else if (obj.type == "subscript") {
    var baselineOffsetValue = Math.floor(-0.375 * (fontSize - fontSize * settings.scale));
  }
  let smallerFont = NSFontManager.sharedFontManager().convertFont_toSize(baseFont, fontSize * settings.scale);

  var range = NSMakeRange(obj.location, obj.length);
  //log('range: ' + obj.location + ', ' + obj.length);

  object.addAttribute_value_forRange(NSFontAttributeName, smallerFont, range);
  object.addAttribute_value_forRange(NSBaselineOffsetAttributeName, baselineOffsetValue, range);
  //log(object.attributeForKey(NSBaselineOffsetAttributeName));

  // object.addAttribute_value_range(
  //   NSBaselineOffsetAttributeName,
  //   baselineOffsetValue,
  //   range
  // );

  //object.addAttribute_value_range(NSBaselineOffsetAttributeName, baselineOffsetValue, range);

  //textStorage.beginEditing();
  //textStorage.addAttributes_range(attrsDict, range);
  //textStorage.addAttribute_value_range(NSBaselineOffsetAttributeName, baselineOffsetValue, range);
  //textStorage.endEditing();
}
