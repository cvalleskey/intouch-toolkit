import UI from 'sketch/ui'
import Document from 'sketch/dom';

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;
let page = document.selectedPage;
let settingsAttribute = getSettingsAttributeForKey_Value(kLowerCaseType, kLowerCaseSmallCapsSelector);

var defaults = {
  "scale" : 0.75
}

function toggleSuperscript() {

    applySuperscriptFontModification();

    // UI.message('Substring attributes.');
}

function applySubstringFontModification() {

    let textLayer = document.selectedLayers.layers[0]

    let textView = textLayer.sketchObject.editingDelegate().textView()
    let textStorage = textView.textStorage()

    let fonts = getFontsFromTextLayer(textLayer)
    fonts.forEach(fontForRange => {
        let font = fontForRange.font
        let range = fontForRange.range
        let fontSize = font.pointSize()

        let descriptor = font
            .fontDescriptor()
            .fontDescriptorByAddingAttributes(settingsAttribute)

        let newFont = NSFont.fontWithDescriptor_size(descriptor,fontSize)
        let attrsDict = NSDictionary.dictionaryWithObject_forKey(newFont,NSFontAttributeName)
        textStorage.addAttributes_range(attrsDict,range)
        textStorage.fixAttributesInRange(range)
    })
    textView.didChangeText()
}

function applySuperscriptFontModification() {

    let textLayer = document.selectedLayers.layers[0]

    let textView = textLayer.sketchObject.editingDelegate().textView()
    let textStorage = textView.textStorage()

    let fonts = getFontsFromTextLayer(textLayer)
    fonts.forEach(fontForRange => {
        let font = fontForRange.font
        let range = fontForRange.range
        let fontSize = font.pointSize() * defaults.scale;

        //log('fontSize before: ' + font.pointSize());
        //log('fontSize after: ' + fontSize);

        log(textStorage);

        let descriptor = font
            .fontDescriptor()
            //.fontDescriptorByAddingAttributes(settingsAttribute)


        let newFont = NSFont.fontWithDescriptor_size(descriptor,fontSize)
        let attrsDict = NSDictionary.dictionaryWithObject_forKey(newFont,NSFontAttributeName)
        textStorage.addAttributes_range(attrsDict,range)
        //textStorage.NSBaselineOffset = 12.0;
        textStorage.fixAttributesInRange(range)
    })
    textView.didChangeText()
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
