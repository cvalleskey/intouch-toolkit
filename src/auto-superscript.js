//framework("CoreText");

import UI from 'sketch/ui';
import Document from 'sketch/dom';

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;
let page = document.selectedPage;
let settingsAttribute = getSettingsAttributeForKey_Value(kLowerCaseType, kLowerCaseSmallCapsSelector);

var defaults = {
  "scale" : 0.75
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

    let fonts = getFontsFromTextLayer(textLayer)

    let baseFontSize = textLayer.style.fontSize;

    for(var i = 0; i < fonts.length; i++) {
        let font = fonts[i].font
        let range = fonts[i].range
        let fontSize = font.pointSize();

        //log('fontSize == baseFontSize? ' + (fontSize == baseFontSize));

        let descriptor = font.fontDescriptor() //.fontDescriptorByAddingAttributes(settingsAttribute)

        var currentBaselineOffset = textStorage.treeAsDictionary().attributes[1][NSBaselineOffsetAttributeName];

        if(currentBaselineOffset == null || currentBaselineOffset == 0) {

          if(mode.type == 'superscript') {
            var baselineOffsetValue = font.pointSize() - (fontSize * defaults.scale);
          } else if (mode.type == 'subscript') {
            var baselineOffsetValue = -1 * (font.pointSize() - (fontSize * defaults.scale));
          } else {
            var baselineOffsetValue = 0;
          }

          let descriptor = font.fontDescriptor() //.fontDescriptorByAddingAttributes(settingsAttribute)
          let newFont = NSFont.fontWithDescriptor_size(descriptor, fontSize * defaults.scale)
          let attrsDict = NSDictionary.dictionaryWithObject_forKey(newFont,NSFontAttributeName)

          textStorage.beginEditing();
          textStorage.addAttributes_range(attrsDict,range);
          textStorage.addAttribute_value_range(NSBaselineOffsetAttributeName, baselineOffsetValue, range);
          textStorage.endEditing();

        } else {

          let baselineOffsetValue = 0;
          let descriptor = font.fontDescriptor() //.fontDescriptorByAddingAttributes(settingsAttribute)
          let newFont = NSFont.fontWithDescriptor_size(descriptor,fontSize)
          let attrsDict = NSDictionary.dictionaryWithObject_forKey(newFont,NSFontAttributeName)

          textStorage.beginEditing();
          textStorage.addAttributes_range(attrsDict,range)
          textStorage.addAttribute_value_range(NSBaselineOffsetAttributeName, baselineOffsetValue, range);
          textStorage.endEditing();

        }

        textStorage.fixAttributesInRange(range)
    }
    textView.didChangeText()
    document.sketchObject.reloadInspector()
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

export function autoSuperscript() { toggleSuperscript(); }
export function autoSubscript() { toggleSubscript(); }
