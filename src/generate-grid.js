import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import Document from 'sketch/dom'

const webviewIdentifier = 'intouch-toolkit.webview'

const config = {
  colors : {
    column : '#00FF0005',
    gutter : '#F32C3A',
    margin : '#456BF9'
  },
  patterns : {
    gutter : "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAASklEQVR4AWL4rGuT/V/PjZuBjgBkH8jezzpWgPbmwAKAKIqB4Cv9Sj/5TSxMIBbMdyW+vxJfw+FwOBwOh8Ph8BaHw7cSf16Jz/0B8zwMcB35KKgAAAAASUVORK5CYII=",
    margin: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAASUlEQVR4AWJwz/6R7VbynxvQ/hwaARDDMBB0wV/Etx2WsXmoRfaI4I5qsfbG/c5fSby3kvjqeTgcDofD4XA4HA6HP0vi4yXxdi8xLzuw8dlqTgAAAABJRU5ErkJggg=="
  }
}

const defaults = {
  columns : 3,
  columnCount: 12,
  breakpoint : "auto",
  gutter : true,
  gutterSize : '2%',
  margin : true,
  marginSize : 20,
  containerWidth : 1180
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
    title: 'Generate Grid',
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

  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    //UI.message('UI loaded!')
  })

  webContents.on('makeGrid', s => {

    generateGrid(s);
    getWebview(webviewIdentifier).close();

  });

  browserWindow.loadURL(require('../resources/generate-grid.html'))
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}

function generateGrid(settings) {

  var settings = {...defaults, ...settings };

  var document = Document.getSelectedDocument();
  let page = document.selectedPage;
  var selection = document.selectedLayers;
  var selected = (selection.length == 1)? selection.layers[0] : false;

  if(!selected) {
    getWebview(webviewIdentifier).close();
    UI.message('Select a layer or artboard to generate a grid.');
    return;
  }

  var columns = settings.columns;
  var gutter = settings.gutter;
  var gutterSize = settings.gutterSize;
  var margin = settings.margin;
  var marginSize = settings.marginSize;

  // Math to change breakpoint if artboard is selected vsettings. object, and if the size is smaller than the max
  if(settings.breakpoint == "auto") {
    var breakpoint = settings.breakpoint;
  } else {
    var breakpoint = parseInt(settings.breakpoint, 10);
  }

  if(selected) {
    if(breakpoint == "auto") {
      breakpoint = selected.frame.width;
    }
  }

  if(Number(breakpoint) > settings.containerWidth) {
    breakpoint = settings.containerWidth;
  }

  // Calculate margin width based on number or percent
  var pixelMarginSize = (margin == 0)? 0 : marginSize;
  if(typeof marginSize == "string" && marginSize.includes('%')) {
    pixelMarginSize = breakpoint * (marginSize.replace("%", "") / 100);
  } else {
    pixelMarginSize = parseFloat(marginSize, 10);
  }

  // Calculate main container space, minus margin on both sides
  let containerFinalWidth = breakpoint - (pixelMarginSize * 2);

  // Calculate single gutter width
  // if(typeof gutterSize == "string") {
  //   var pixelGutterSize = containerFinalWidth * (gutterSize.replace("%", "") / 100);
  // } else {
  //   var pixelGutterSize = gutterSize;
  // }
  // if(gutter == 0) {
  //   pixelGutterSize = 0;
  // }

  var pixelGutterSize = (margin == 0)? 0 : marginSize;
  if(typeof gutterSize == "string" && gutterSize.includes('%')) {
    pixelGutterSize = containerFinalWidth * (gutterSize.replace("%", "") / 100);
  } else {
    pixelGutterSize = parseFloat(gutterSize, 10);
  }

  // Calculate single column width
  let pixelColumnWidth = parseFloat(((containerFinalWidth - (pixelGutterSize)*(settings.columnCount-1)) / settings.columnCount).toFixed(4), 10);

  var columnsArray = [];

  if(columns == "auto") {

    if(selected.frame) {

      var selectedWidth = selected.frame.width;

      if(selectedWidth < 600) {
        columns = [12];
      } else {
        columns = Array(12).fill(1);
      }

    } else {
      UI.message('To use auto, please select an artboard.');
      return;
    }

  } else if(columns == "1") {
    columns = [12];
  } else if(columns == "2") {
		columns = [6,6];
  } else if(columns == "3") {
		columns = [4,4,4];
  } else if(columns == "4") {
		columns = [3,3,3,3];
  } else if(columns == "6") {
		columns = [2,2,2,2,2,2];
  } else if(columns == "12") {
		columns = Array(12).fill(1);
  } else if(columns == "8,4") {
    columns = [8,4];
  } else if(columns == "3,9") {
    columns = [3,9];
  }

  for(var i = 0; i < columns.length; i++) {

		var column = columns[i];

    // Add outer margin
    if(i == 0 && margin) {
      columnsArray.push({
        type: 'margin',
        width : pixelMarginSize
      });
    }

    // Add gutter
    if(i != 0 && gutter) {
      columnsArray.push({
        type: 'gutter',
        width : pixelGutterSize
      });
    }
    // Add column
    columnsArray.push({
      type: 'column',
      width: Number(((column-1) * pixelGutterSize + column * pixelColumnWidth).toFixed(2)) // pixelMarginSize
    });

    // Add outer margin
    if(i == (columns.length-1) && margin) {
      columnsArray.push({
        type: 'margin',
        width : pixelMarginSize
      });
    }
  }

  var grids = {
    name : '📐 Grid',
    frame : {
      width : breakpoint,
      height : (selection.length == 1)? selected.frame.height : 100
    }
  }

  if(selected.type == "Artboard") {
    grids.parent = selected;
    grids.frame.x = (selected.frame.width - breakpoint) / 2;
    // gridsettings.frame.y = 0;
  } else if(selected.type == "ShapePath") {
    if(breakpoint >= selected.frame.width) {
      grids.frame.x = selected.frame.x;
    } else {
      grids.frame.x = (selected.frame.width - breakpoint) / 2;
    }
    grids.frame.y = selected.frame.y;
    if(selected.getParentArtboard() == undefined) {
      grids.parent = page;
    } else {
      //gridsettings.parent = selected.getParentArtboard();
      grids.parent = selected.parent;
    }
  }

  var gridGroup = new Document.Group(grids);

  var _x = 0;
  var _y = 0;

  for(var x = 0; x < columnsArray.length; x++) {

    var el = columnsArray[x];

    var shape = new Document.ShapePath({
        parent: gridGroup,
        name : el.type,
        frame: {
          x: _x,
          y: _y,
          width: el.width,
          height: (selection.length == 1)? selection.layers[0].frame.height : 100
        },
        style: { fills: [config.colors.column] }
    });

    if(el.type == "gutter" || el.type == "margin") {
      shape.style.fills = [
        {
          fillType : Document.Style.FillType.Pattern,
          pattern : {
            patternType : Document.Style.PatternFillType.Tile,
            tileScale : 0.25,
            image : { "base64": config.patterns[el.type]}
            //image : loadLocalImage("/Users/chrisettings.valleskey/Documents/github/intouch-toolkit/intouch-toolkit.sketchplugin/Contents/Resources/shade-" + el.type + ".png"),
          }
        }
      ];
      shape.style.innerShadows = [
        { color : config.colors[el.type], x : 1, y : 0, blur : 0, spread : 0 },
        { color : config.colors[el.type], x : -1, y : 0, blur : 0, spread : 0 }
      ];
    }

    _x += el.width;
  }

  gridGroup.adjustToFit();
}

export function makeGridOne()       { generateGrid({ columns: "1" }); }
export function makeGridTwo()       { generateGrid({ columns: "2" }); }
export function makeGridThree()     { generateGrid({ columns: "3" }); }
export function makeGridFour()      { generateGrid({ columns: "4" }); }
export function makeGridSix()       { generateGrid({ columns: "6" }); }
export function makeGridEightFour() { generateGrid({ columns: "8,4" }); }
export function makeGridThreeNine() { generateGrid({ columns: "3,9" }); }
