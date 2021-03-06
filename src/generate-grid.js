/*--------------------------------------------*\

Generate Grid
=============

Renders a group of layers which act as boundaries
and zones for margins, gaps, and columns. Also
supports auto-updating when resized.

To-do:
- Better UI
- Preview and instant updates
- Support nested grids (indirect selection)

\*-------------------------------------------*/

import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import Document from 'sketch/dom'
import Settings from 'sketch/settings'
import Track from "sketch-module-google-analytics"

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

var defaults = {
  columns : 3,
  columnCount: 12,
  breakpoint : "auto",
  gutter : true,
  gutterSize: 2,
  gutterUnit: '%',
  margin : true,
  marginSize : 20,
  marginUnit: 'px',
  containerMaxWidth : 1000000, /* 1180 */
}

function loadLocalImage(filePath) {
    if(!NSFileManager.defaultManager().fileExistsAtPath(filePath)) {
        return null;
    }
    return NSImage.alloc().initWithContentsOfFile(filePath);
}

export default function (context) {

  const options = {
    identifier: webviewIdentifier,
    width: 400,
    height: 172,
    show: false,
    title: 'Columns',
    parent: Document.getSelectedDocument(),
    center: true
  }

  const browserWindow = new BrowserWindow(options)

  browserWindow.once('ready-to-show', () => {

    var document = Document.getSelectedDocument();

    browserWindow.show();

    // TO-DO: Support updating multiple grids at the same time
    if(document.selectedLayers.length) {
      document.selectedLayers.forEach(layer => {
        var selectedGridSettings = Settings.layerSettingForKey(layer, 'column-settings');
        if(selectedGridSettings) {
          defaults = { isUpdate: true, ...defaults, ...selectedGridSettings}
        }
      });

      browserWindow.webContents
        .executeJavaScript(`getStoredSettings(${JSON.stringify(defaults)})`)
        .then(res => browserWindow.show())
        .catch(error => log(error))
    } else {
      getWebview(webviewIdentifier).close();
      UI.message('Select a layer or artboard to generate a grid.');
    }
  })

  const webContents = browserWindow.webContents

  webContents.on('makeGrid', s => {
    generateGridFromSelectedLayers(s);
    getWebview(webviewIdentifier).close();
  });

  webContents.on('nativeLog', s => log(s));

  browserWindow.loadURL(require('../resources/generate-grid.html'))
}

export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}

export function onLayersResized(context) {
  var document = Document.getSelectedDocument();
  var selection = document.selectedLayers;
  selection.forEach(layer => {
    var savedGridSettings = Settings.layerSettingForKey(layer, 'column-settings');
    if(savedGridSettings) {
      generateGrid(layer, savedGridSettings);
    }
  })
}

function generateGridFromSelectedLayers(settings) {
  var document = Document.getSelectedDocument();
  var selection = document.selectedLayers;
  selection.layers.forEach(layer => {
      generateGrid(layer, settings);
  })
}

function generateGrid(layer, settings) {

  Settings.setSettingForKey('intouch-toolkit.generate-grid', settings)

  var settings = {...defaults, ...settings };

  var document = Document.getSelectedDocument();
  let page = document.selectedPage;

  // if(!selected) {
  //   getWebview(webviewIdentifier).close();
  //   UI.message('Select a layer or artboard to generate a grid.');
  //   return;
  // }

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

  // if(selected) {
  //   if(breakpoint == "auto") {
  //     breakpoint = selected.frame.width;
  //   }
  // }

  breakpoint = layer.frame.width;

  if(Number(breakpoint) > settings.containerMaxWidth) {
    breakpoint = settings.containerMaxWidth;
  }

  // Calculate margin width based on number or percent
  if(marginSize == 0) {
    var pixelMarginSize = 0;
  } else {
    if(settings.marginUnit == "%") {
      var pixelMarginSize = breakpoint * (marginSize / 100);
    } else {
      var pixelMarginSize = parseFloat(marginSize, 10);
    }
  }

  // Calculate main container space, minus margin on both sides
  let containerFinalWidth = breakpoint - (pixelMarginSize * 2);

  // Calculate single gutter width
  if(gutterSize == 0) {
    var pixelGutterSize = 0;
  } else {
    if(settings.gutterUnit == "%") {
      var pixelGutterSize = (breakpoint - pixelMarginSize * 2) * (gutterSize / 100);
    } else {
      var pixelGutterSize = parseFloat(gutterSize, 10);
    }
  }

  // Calculate single column width
  let pixelColumnWidth = parseFloat(((containerFinalWidth - (pixelGutterSize)*(settings.columnCount-1)) / settings.columnCount), 10);

  var columnsArray = [];

  if(columns == "auto") {

    if(layer.frame) {

      var layerWidth = layer.frame.width;

      if(layerWidth < 600) {
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
  } else if(columns == "12") {
    columns = [1,1,1,1,1,1,1,1,1,1,1,1];
  }

  for(var i = 0; i < columns.length; i++) {

		var column = columns[i];

    // Add outer margin
    if(i == 0 && marginSize) {
      columnsArray.push({
        type: 'margin',
        width : pixelMarginSize
      });
    }

    // Add gutter
    if(i != 0 && gutterSize) {
      columnsArray.push({
        type: 'gutter',
        width : pixelGutterSize
      });
    }
    // Add column
    columnsArray.push({
      type: 'column',
      width: parseFloat(((column-1) * pixelGutterSize + column * pixelColumnWidth), 10) // pixelMarginSize
    });

    // Add outer margin
    if(i == (columns.length-1) && marginSize) {
      columnsArray.push({
        type: 'margin',
        width : pixelMarginSize
      });
    }
  }

  var grids = {
    name : '📐 Columns',
    frame : {
      width : breakpoint,
      height : layer.frame.height
    }
  }

  var _x = 0;
  var _y = 0;

  if(layer.type == "Artboard") {
    grids.parent = layer;
  } else {
    grids.parent = layer.parent.id? layer.parent : page;
    _x = layer.frame.x;
    _y = layer.frame.y;
  }
  if(layer.frame.width > breakpoint) {
    _x += (layer.frame.width - breakpoint) / 2;
  }

  grids.frame.x = _x;
  grids.frame.y = _y;


  var gridGroup = new Document.Group(grids);

  gridGroup.index = layer.index + 1;

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
          height: layer.frame.height
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

  var layerGridSettings = Settings.layerSettingForKey(layer, 'column-settings');
  if(layerGridSettings) {
    layer.remove();
  }

  gridGroup.adjustToFit();
  document.selectedLayers = [gridGroup];
  Settings.setLayerSettingForKey(gridGroup, 'column-settings', settings);

  Track("UA-2641354-26", "event", { ec: "grid", ea: "makeGrid", el: JSON.stringify(settings) });
}

export function makeGridOne()       { generateGridFromSelectedLayers({ columns: "1" }); }
export function makeGridTwo()       { generateGridFromSelectedLayers({ columns: "2" }); }
export function makeGridThree()     { generateGridFromSelectedLayers({ columns: "3" }); }
export function makeGridFour()      { generateGridFromSelectedLayers({ columns: "4" }); }
export function makeGridSix()       { generateGridFromSelectedLayers({ columns: "6" }); }
export function makeGridEightFour() { generateGridFromSelectedLayers({ columns: "8,4" }); }
export function makeGridThreeNine() { generateGridFromSelectedLayers({ columns: "3,9" }); }
