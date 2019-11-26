import UI from 'sketch/ui';
import Document from 'sketch/dom';
import Track from "sketch-module-google-analytics";

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;
let page = document.selectedPage;

var settings = {
  "scale" : 0.625
}

function toggleSuperscript() {
  applyFontModification({ type: 'superscript' });
  Track("UA-2641354-26", "event", { ec: "superscript", ea: "doSuperscript" });
}

function toggleSubscript() {
  applyFontModification({ type: 'subscript' });
  Track("UA-2641354-26", "event", { ec: "subscript", ea: "doSubscript" });
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

    let range = selectedRange;
    let fontSize = textLayer.style.fontSize;
    let newFontSize = fontSize * settings.scale;
    let descriptor = font.fontDescriptor();
    let baseFontSize = textLayer.style.fontSize;

    var currentBaselineOffset = 0;
    var selectedIndex = Number(range.location);
    var textStorageAttributes = textStorage.treeAsDictionary().attributes;

    for(var i = 0; i < textStorageAttributes.length; i++) {
      var textStorageIndex = Number(textStorageAttributes[i].location);

      if(selectedIndex == textStorageIndex) {
        if(textStorageAttributes[i][NSBaselineOffsetAttributeName] == null) {
           currentBaselineOffset = 0;
        } else {
          currentBaselineOffset = Number(textStorageAttributes[i][NSBaselineOffsetAttributeName]);
        }
        break;
      }
    }

    var baselineOffsetValue = getBaselineOffsetValue(mode.type, fontSize, settings.scale);
    if((mode.type == 'superscript' && currentBaselineOffset > 0) || (mode.type == 'subscript' && currentBaselineOffset < 0)) {
      baselineOffsetValue = 0;
      newFontSize = fontSize;
    }

    let newFont = NSFont.fontWithDescriptor_size(descriptor, newFontSize)
    let attrsDict = NSDictionary.dictionaryWithObject_forKey(newFont,NSFontAttributeName)

    textStorage.beginEditing();
    textStorage.addAttributes_range(attrsDict, range);
    textStorage.addAttribute_value_range(NSBaselineOffsetAttributeName, baselineOffsetValue, range);
    textStorage.endEditing();

    textStorage.fixAttributesInRange(range);
    textView.didChangeText();
    document.sketchObject.reloadInspector();
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

function getBaselineOffsetValue(type, fontSize, scale) {
  if (type == "superscript") {
    return Math.floor(fontSize - fontSize * scale);
  } else if (type == "subscript") {
    return Math.floor(-0.375 * (fontSize - fontSize * scale));
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
