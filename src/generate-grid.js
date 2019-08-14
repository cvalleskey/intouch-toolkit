import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import Document from 'sketch/dom'

const webviewIdentifier = 'intouch-toolkit.webview'

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 480,
    height: 300,
    show: false,
    title: 'Generate Grid',
    titleBarStyle: 'hiddenInset'
  }
  const settings = {
    containerWidth : 1180,
    outerMargin: 20,
    marginWidth : 0.02,
    colors : {
      column : '#0FFF00',
      outerMargin : '#FF0000',
      margin : '#FF0000'
    },
    columnCount: 12
  }

  const browserWindow = new BrowserWindow(options)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  const webContents = browserWindow.webContents

  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    //UI.message('UI loaded!')
  })

  webContents.on('makeGrid', s => {

    var document = Document.getSelectedDocument();
    let page = document.selectedPage;
    var selection = document.selectedLayers;
    var selected = (selection.length == 1)? selection.layers[0] : false;

    var columns = Number(s.columns);
    if(s.breakpoint == "auto") {
      var breakpoint = s.breakpoint;
    } else {
      var breakpoint = Number(s.breakpoint);
    }
    var margin = Number(s.margin);
    var outerMargin = Number(s.outerMargin);

    if(selected) {
      if(breakpoint == "auto") {
        breakpoint = selected.frame.width;
      }
    }

    if(Number(breakpoint) > settings.containerWidth) {
      breakpoint = settings.containerWidth;
    }

    //UI.message('breakpoint: ' + breakpoint);

    let containerFinalWidth = breakpoint - (settings.outerMargin * 2 * outerMargin);
    let mWidth = containerFinalWidth * (settings.marginWidth * margin);
    let cWidth = Number(((containerFinalWidth - (mWidth)*(settings.columnCount-1)) / settings.columnCount).toFixed(2));

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

      // Add inner margin
      if(i == 0 && outerMargin) {
        columnsArray.push({
          type: 'outerMargin',
          width : settings.outerMargin
        });
      }

      // Add margin
      if(i != 0 && margin) {
        columnsArray.push({
          type: 'margin',
          width : mWidth
        });
      }
      // Add column
      columnsArray.push({
        type: 'column',
        width: Number(((column-1) * mWidth + column * cWidth).toFixed(2))
      });

      // Add inner margin
      if(i == (columns.length-1) && outerMargin) {
        columnsArray.push({
          type: 'outerMargin',
          width : settings.outerMargin
        });
      }
    }

    var gridSettings = {
      parent : page,
      name : '📐 Grid',
      frame : {
        width : breakpoint,
        height : (selection.length == 1)? selected.frame.height : 100
      }
    }
    if(selected.type == "Artboard") {
      gridSettings.parent = selected;
      gridSettings.frame.x = (selected.frame.width - breakpoint) / 2;
      // gridSettings.frame.y = 0;
    } else if(selected.type == "ShapePath") {
      if(breakpoint >= selected.frame.width) {
        gridSettings.frame.x = selected.frame.x;
      } else {
        gridSettings.frame.x = (selected.frame.width - breakpoint) / 2;
      }
      gridSettings.frame.y = selected.frame.y;
      gridSettings.parent = selected.getParentArtboard();
    }

    var gridGroup = new Document.Group(gridSettings);

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
          style: { fills: [settings.colors[el.type] + '22'] }
      });
      if(!margin && el.type == 'column') {
        shape.style.innerShadows = [
          {
            color : settings.colors['margin'],
            x : -0.5,
            y : 0,
            blur : 0,
            spread : 0
          },{
            color : settings.colors['margin'],
            x : 0.5,
            y : 0,
            blur : 0,
            spread : 0
          }
        ];
      }

      _x += el.width;
    }

    gridGroup.adjustToFit();

    // if(selection.length == 1) {
    //   gridGroup.x = 100; //(gridGroup.frame.width-selected.frame.width) / 2;
    // }

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
