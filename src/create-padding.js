import UI from 'sketch/ui'
import Document from 'sketch/dom';

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;
let page = document.selectedPage;

// let imageurl = "./shade-blue.png";
// let imageurl_nsurl = NSURL.alloc().initWithString(imageurl);
// let nsimage = NSImage.alloc().initByReferencingURL(imageurl_nsurl);

//let nsimage = NSImage.alloc().initByReferencingFile(document.plugin.urlForResourceNamed("shade-blue.png").path());

//UI.message('nsimage: ' + Document.plugin.urlForResourceNamed("shade-blue.png").path());

var sizes = {
  "thin" : 1,
  "thick" : 2,
  "xsmall" : 4,
  "small" : 8,
  "medium" : 16,
  "large" : 32,
  "xlarge" : 64,
  "xxlarge" : 128
}

function loadLocalImage(filePath) {
    if(!NSFileManager.defaultManager().fileExistsAtPath(filePath)) {
        return null;
    }
    return NSImage.alloc().initWithContentsOfFile(filePath);
}

function makePadding(size) {



  if (selectedLayers.length) {

    selectedLayers.forEach(function (layer, i) {

      var parent = layer.getParentArtboard();
      if(parent == undefined) {
        parent = page;
      }

      var shapePath = new Document.Shape({
        parent: parent, // todo: test outside of an artboard
        name : "🔲 Padding " + size,
        frame: {
          x: layer.frame.x,
          y: layer.frame.y,
          width: layer.frame.width,
          height: layer.frame.height
        },
        style: {
          fills: [
            {
              fillType : Document.Style.FillType.Pattern,
              pattern : {
                patternType : Document.Style.PatternFillType.Tile,
                tileScale : 0.25,
                image : loadLocalImage("/Users/chris.valleskey/Documents/github/intouch-toolkit/intouch-toolkit.sketchplugin/Contents/Resources/shade-blue.png"),
              }
            }
          ],
          innerShadows: [
            {
              color : '#45CAF9',
              x : 0,
              y : 0,
              blur : 0,
              spread : 1
            }
          ]
        }
      });

      var maskShape = new Document.ShapePath({
        parent: shapePath,
        frame: {
          x: sizes[size],
          y: sizes[size],
          width: layer.frame.width - sizes[size]*2,
          height: layer.frame.height - sizes[size]*2
        }
      });
      maskShape.sketchObject.resizingConstraint = 18;

      //UI.message('Padding ' + size + ' (' + sizes[size] + 'px) added.');
    });
  } else {
    UI.message('Select an object to create padding.');
  }
}

export function paddingXSmall() { makePadding('xsmall'); }
export function paddingSmall() { makePadding('small'); }
export function paddingMedium() { makePadding('medium'); }
export function paddingLarge() { makePadding('large'); }
export function paddingXLarge() { makePadding('xlarge'); }
export function paddingXXLarge() { makePadding('xxlarge'); }
