import UI from 'sketch/ui'
import Document from 'sketch/dom';

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;

// let imageurl = "./shade-blue.png";
// let imageurl_nsurl = NSURL.alloc().initWithString(imageurl);
// let nsimage = NSImage.alloc().initByReferencingURL(imageurl_nsurl);

//let nsimage = NSImage.alloc().initByReferencingFile(document.plugin.urlForResourceNamed("shade-blue.png").path());

//UI.message('nsimage: ' + Document.plugin.urlForResourceNamed("shade-blue.png").path());

var sizes = {
  "thin" : 1,
  "thick" : 2,
  "xxsmall" : 4,
  "xsmall" : 8,
  "small" : 16,
  "medium" : 32,
  "large" : 64,
  "xlarge" : 128
}

function makePadding(size) {

  if (selectedLayers.length) {

    selectedLayers.forEach(function (layer, i) {


      // var rectShapeGroup = MSShapeGroup.shapeWithRect(NSMakeRect(0, 0, layer.frame.width, layer.frame.height));
      // var rectShape = MSRectangleShape.new();
      // rectShape.frame = MSRect.rectWithRect(NSMakeRect(sizes[size], sizes[size], layer.frame.width - sizes[size]*2, layer.frame.height - sizes[size]*2));
      // rectShapeGroup.layers().addObject(rectShape);
      // rectShapeGroup.layers()[1].setBooleanOperation(1); // subtract
      // rectShapeGroup.setAsParentOnChildren();
      // var fill = rectShapeGroup.style().addStylePartOfType(0);
      // fill.color = MSColor.blackColor();
      //
      // context.document.currentPage().addLayers([rectShapeGroup]);

      var shapePath = new Document.Shape({
        parent: layer.getParentArtboard(), // todo: test outside of an artboard
        name : "🔲 Padding " + size,
        frame: {
          x: layer.frame.x, //+ sizes[size],
          y: layer.frame.y, //+ sizes[size],
          width: layer.frame.width, //- sizes[size]*2,
          height: layer.frame.height //- sizes[size]*2
        },
        style: {
          fills: [
            '#45CAF940'
            //{
            // fill: 'Pattern',
            // pattern: {
            //   patternType: Style.PatternFillType.Fill,
            //   image: nsimage,
            // }
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

      var shape2 = new Document.ShapePath({
        parent: shapePath, // todo: test outside of an artboard
        frame: {
          x: sizes[size],
          y: sizes[size],
          width: layer.frame.width - sizes[size]*2,
          height: layer.frame.height - sizes[size]*2
        }
      });

      UI.message('hmm..');
    });
  }
}

export function paddingSmall() { makePadding('small'); }
export function paddingMedium() { makePadding('medium'); }
export function paddingLarge() { makePadding('large'); }
