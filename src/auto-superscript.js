//framework("CoreText");

import UI from 'sketch/ui';
import Document from 'sketch/dom';

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;
let page = document.selectedPage;

var defaults = {
  "scale" : 0.625
}

function toggleSuperscript() {
  applyFontModification({ type: 'superscript' });
}

function toggleSubscript() {
  applyFontModification({ type: 'subscript' });
}

function applyFontModification(mode) {

    let textLayer = document.selectedLayers.layers[0]

    let textView = textLayer.sketchObject.editingDelegate().textView()
    let textStorage = textView.textStorage()
    let selectedRange = textView.selectedRange()
    let effectiveRange = MOPointer.alloc().init()

    let font = textLayer.sketchObject.attributedStringValue().attribute_atIndex_longestEffectiveRange_inRange(
        NSFontAttributeName,
        0,
        NSMakeRange(0, 1),
        selectedRange
    );
    //log('attrs: ' + attrString);

    // Need to remove the dependency on getFontsFromTextLayer
    //let fonts = getFontsFromTextLayer(textLayer)
    //let font = fonts[0].font;

    //log('font: ' + font);
    //log('font.fontDescriptor: ' + font.fontDescriptor());

    //let font = fonts[0].font;
    let range = selectedRange;
    let fontSize = textLayer.style.fontSize; // font.pointSize();
    let descriptor = font.fontDescriptor() //.fontDescriptorByAddingAttributes(settingsAttribute)
    let baseFontSize = textLayer.style.fontSize;

    // for(var i = 0; i < fonts.length; i++) {
    //   log('selection index: ' +fonts[i].range.location);
    // }

    //for(var i = 0; i < fonts.length; i++) {

        //log('fontSize == baseFontSize? ' + (fontSize == baseFontSize));

        //log('textStorage');
        //log(textStorage.treeAsDictionary().attributes);

        // This needs to match the baseline of whatever is selected.
        // Right now it gets the baselineOffset of the first character.
        //var currentBaselineOffset = textStorage.treeAsDictionary().attributes[i][NSBaselineOffsetAttributeName];

        var currentBaselineOffset = 0;
        var selectedIndex = Number(range.location);
        var textStorageAttributes = textStorage.treeAsDictionary().attributes;
        for(var i = 0; i < textStorageAttributes.length; i++) {
          var textStorageIndex = Number(textStorageAttributes[i].location);
          //log('sel: ' + selectedIndex);
          //log('loc: ' + textStorageIndex);
          if(selectedIndex == textStorageIndex) {
            //log('baseline found: ' + textStorageAttributes[i][NSBaselineOffsetAttributeName])
            if(textStorageAttributes[i][NSBaselineOffsetAttributeName] == null) {
               currentBaselineOffset = textStorageAttributes[i][NSBaselineOffsetAttributeName];
            } else {
              currentBaselineOffset = Number(textStorageAttributes[i][NSBaselineOffsetAttributeName]);
            }
            break;
          }
        }
        //log('baseline: ' + currentBaselineOffset);

        if(currentBaselineOffset == null || currentBaselineOffset == 0) {

          if(mode.type == 'superscript') {
            var baselineOffsetValue = Math.floor(fontSize - fontSize * defaults.scale);
          } else if (mode.type == 'subscript') {
            var baselineOffsetValue = Math.floor(-1 * (fontSize - fontSize * defaults.scale));
          } else {
            var baselineOffsetValue = 0;
          }

          let descriptor = font.fontDescriptor() //.fontDescriptorByAddingAttributes(settingsAttribute)
          let newFont = NSFont.fontWithDescriptor_size(descriptor, fontSize * defaults.scale)
          let attrsDict = NSDictionary.dictionaryWithObject_forKey(newFont,NSFontAttributeName)

          textStorage.beginEditing();
          textStorage.addAttributes_range(attrsDict, range);
          textStorage.addAttribute_value_range(NSBaselineOffsetAttributeName, baselineOffsetValue, range);
          textStorage.endEditing();

        } else {

          let baselineOffsetValue = 0;
          let descriptor = font.fontDescriptor() //.fontDescriptorByAddingAttributes(settingsAttribute)
          let newFont = NSFont.fontWithDescriptor_size(descriptor,fontSize)
          let attrsDict = NSDictionary.dictionaryWithObject_forKey(newFont,NSFontAttributeName)

          textStorage.beginEditing();
          textStorage.addAttributes_range(attrsDict, range)
          textStorage.addAttribute_value_range(NSBaselineOffsetAttributeName, baselineOffsetValue, range);
          textStorage.endEditing();

        }

        textStorage.fixAttributesInRange(range)
    //}
    textView.didChangeText()
    document.sketchObject.reloadInspector()

    getBaselineOffsetTexts();
}

function getFontAttributesForSelectedRange() {

    let textLayer = document.selectedLayers.layers[0]

    let fonts = getFontsFromTextLayer(textLayer)
    fonts.forEach((fontForRange, index) => {
        let font = fontForRange.font
        let fontFeatureSettings = font.fontDescriptor().fontAttributes()[NSFontFeatureSettingsAttribute]
        console.log("Font" + (1 + index))
        console.log(fontFeatureSettings)
    })
}

// ----- Helper Functions

function getSettingsAttributeForKey_Value(key, value) {
    let settingsAttribute = {
        [NSFontFeatureSettingsAttribute]: [{
            [NSFontFeatureTypeIdentifierKey]: key,
            [NSFontFeatureSelectorIdentifierKey]: value
        }]
    }

    return settingsAttribute
}

function getFontsFromTextLayer(textLayer) {
    let msTextLayer = textLayer.sketchObject
    let attributedString = msTextLayer.attributedStringValue()
    let textView = msTextLayer.editingDelegate().textView()
    let selectedRange = textView.selectedRange()
    let effectiveRange = MOPointer.alloc().init()

    let fonts = []

    if (selectedRange.length == 0) {
        let font = attributedString.attribute_atIndex_longestEffectiveRange_inRange(
            NSFontAttributeName,
            selectedRange.location,
            effectiveRange,
            selectedRange
        )
        fonts.push({"font": font, "range": effectiveRange.value()})
    }

    // The problem with this is it isn't reading the live value of the text.
    // Need to get the live attributedStringValue to then run
    while (selectedRange.length > 0) {
        let font = attributedString.attribute_atIndex_longestEffectiveRange_inRange(
            NSFontAttributeName,
            selectedRange.location,
            effectiveRange,
            selectedRange
        )
        selectedRange = NSMakeRange(
            NSMaxRange(effectiveRange.value()),
            NSMaxRange(selectedRange) - NSMaxRange(effectiveRange.value())
        )

        fonts.push({"font": font, "range": effectiveRange.value()})
    }
    return fonts
}

function getBaselineOffsetTexts() {

  var textStyles = [];

  document.pages.forEach(function(page){
    page.layers.forEach(processLayer);
  })

  console.log(textStyles);

  function processLayer(layer){
    if(layer.type == 'Text'){

      let textView = layer.sketchObject.attributedStringValue().treeAsDictionary();
      textView.attributes.forEach(function(attr){

        var baselineOffset = attr['NSBaselineOffset'];
        if(baselineOffset != null && baselineOffset != 0) {
          textStyles.push({
            id : layer.id,
            baselineOffset : baselineOffset,
            location : attr['location'],
            length : attr['length'],
            text : attr['text']
          });
        }
      });
      //log('textView: ' + layer.sketchObject.attributedStringValue());
      //let textStorage = textView.textStorage();
      //var textStorageAttributes = textStorage.treeAsDictionary().attributes;

      // for(var i = 0; i < textStorageAttributes.length; i++) {
      //   textStyles.push({
      //     'baselineOffset' : textStorageAttributes[i][NSBaselineOffsetAttributeName]
      //   });
      // }


      // textStyles.push({
      //   font: layer.style.fontFamily,
      //   size: layer.style.fontSize,
      //   color: layer.style.textColor // etc...
      // });
    }
    if(layer.layers){
      layer.layers.forEach(processLayer);
    }
  }
}

export function autoSuperscript() { toggleSuperscript(); }
export function autoSubscript() { toggleSubscript(); }

export function onTextStyleUpdateBegin(context) {
  log("onTextStyleUpdateBegin");
}

export function onTextStyleUpdateFinish(context) {
  log("onTextStyleUpdateFinish");
}
