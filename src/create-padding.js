import UI from 'sketch/ui'
import Document from 'sketch/dom';
import Track from "sketch-module-google-analytics";

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;
let page = document.selectedPage;

// let imageurl = "./shade-blue.png";
// let imageurl_nsurl = NSURL.alloc().initWithString(imageurl);
// let nsimage = NSImage.alloc().initByReferencingURL(imageurl_nsurl);

//let nsimage = NSImage.alloc().initByReferencingFile(document.plugin.urlForResourceNamed("shade-blue.png").path());

//UI.message('nsimage: ' + Document.plugin.urlForResourceNamed("shade-blue.png").path());

var settings = {
  pattern : "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAASklEQVR4AWJwO/Ury+3if24GOgKQfSB7XU7/BLQ3BxYARFEMBF/n1/rJb2JhArFgvivx/ZX4Gg6Hw+FwOBwOh7c4HL6V+PNKfO4PEdd2MBzwoFMAAAAASUVORK5CYII=",
  sizes: {
    "thin" : 1,
    "thick" : 2,
    "xsmall" : 4,
    "small" : 8,
    "medium" : 16,
    "large" : 32,
    "xlarge" : 64,
    "xxlarge" : 128
  }
}

function loadLocalImage(filePath) {
    if(!NSFileManager.defaultManager().fileExistsAtPath(filePath)) {
        return null;
    }
    return NSImage.alloc().initWithContentsOfFile(filePath);
}

export default function () {

  const options = {
    identifier: webviewIdentifier,
    width: 480,
    height: 350,
    show: false,
    title: 'Make Padding',
    titleBarStyle: 'hiddenInset'
  }

  const browserWindow = new BrowserWindow(options)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {

    var document = Document.getSelectedDocument();
    let page = document.selectedPage;
    var selection = document.selectedLayers;
    var selected = (selection.length == 1)? selection.layers[0] : false;

    if(selected) {
      browserWindow.show()
    } else {
      getWebview(webviewIdentifier).close();
      UI.message('Select a layer or artboard to generate a grid.');
    }
  })

  const webContents = browserWindow.webContents
  webContents.on('makePadding', s => {
    var size = [16,32]; // Other accepted values: 16, [16, 32, 24], [16, 24, 32, 48]
    makePadding(size);
    getWebview(webviewIdentifier).close();
  });

  browserWindow.loadURL(require('../resources/make-padding.html'))
}

function makePadding(size) {

  if (selectedLayers.length) {

    selectedLayers.forEach(function (layer, i) {

      //var parent = layer.getParentArtboard();
      var parent = layer.parent;
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
                //image : loadLocalImage("/Users/chris.valleskey/Documents/github/intouch-toolkit/intouch-toolkit.sketchplugin/Contents/Resources/shade-blue.png"),
                image : { "base64": settings.pattern }
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
          x: settings.sizes[size],
          y: settings.sizes[size],
          width: layer.frame.width - settings.sizes[size]*2,
          height: layer.frame.height - settings.sizes[size]*2
        }
      });
      maskShape.sketchObject.resizingConstraint = 18;

      //UI.message('Padding ' + size + ' (' + settings.sizes[size] + 'px) added.');
    });
  } else {
    UI.message('Select an object to create padding.');
  }
  Track("UA-2641354-26", "event", { ec: "padding", ea: "makePadding", el: size });
}

export function paddingXSmall() { makePadding('xsmall'); }
export function paddingSmall() { makePadding('small'); }
export function paddingMedium() { makePadding('medium'); }
export function paddingLarge() { makePadding('large'); }
export function paddingXLarge() { makePadding('xlarge'); }
export function paddingXXLarge() { makePadding('xxlarge'); }
