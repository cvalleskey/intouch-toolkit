/*-------------------------------------------*\

Generate Type Scale
===================

Uses native Sketch features and attributes to export color, gradient,
type, and spacing rules into a design token configuration file.

Options:
- Generate Single (Single)/Web/Mobile App


\*-------------------------------------------*/

import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import Document from 'sketch/dom'

const webviewIdentifier = 'intouch-toolkit.webview'

export default function () {

  const webViewOptions = {
    identifier: webviewIdentifier,
    webpage: "generate-type-scale.html",
    width: 480,
    height: 370,
    show: false,
    title: 'Generate Type Scale',
    titleBarStyle: 'hiddenInset'
  }
  const settings = {
    breakpoints : [
      { name: "xs", value: 0 },
      { name: "sm", value: 640 },
      { name: "md", value: 992 },
      { name: "lg", value: 1200 },
      { name: "xl", value: 1440 }
    ],
    round: false
  }
  var props = {
    styles: [
      {
        fontSize : { min: 32, max: 66 },
        lineHeight: 1.125,
        paragraphspacing: 0.25,
        fontWeight: 12,
        fontFamily: "Abril Fatface",
        name: "Title",
      },
      {
        fontSize : {
          min: 24,
          max: 48,
        },
        lineHeight: 1.125,
        paragraphspacing: 0.25,
        fontWeight: 12,
        fontFamily: "Abril Fatface",
        name: "Headline",
      },
      {
        fontSize : {
          min: 20,
          max: 28,
        },
        lineHeight: 1.125,
        paragraphspacing: 0.25,
        fontWeight: 12,
        fontFamily: "Abril Fatface",
        name: "Subhead",
      },
      {
        fontSize : {
          min: 18,
          max: 24,
        },
        lineHeight: 1.125,
        paragraphspacing: 0.25,
        fontWeight: 7,
        fontFamily: "Avenir Next",
        name: "Caption",
      },
      {
        fontSize : {
          min: 16,
          max: 22,
        },
        lineHeight: 1.5,
        paragraphspacing: 0.5,
        fontWeight: 5,
        fontFamily: "Avenir Next",
        name: "Body",
      },
      {
        fontSize : {
          min: 12,
          max: 13,
        },
        lineHeight: 1.5,
        paragraphspacing: 0.5,
        fontWeight: 5,
        fontFamily: "Avenir Next",
        name: "Footnote",
      },
    ]
  }

  const browserWindow = new BrowserWindow(webViewOptions)

  browserWindow.once('ready-to-show', () => {
    browserWindow.show()

    let document = Document.getSelectedDocument();
    let styles = document.sharedTextStyles;

    var parsedStyles = [];
    for(var i = 0; i < settings.breakpoints.length; i++) {
      var breakpoint = settings.breakpoints[i];
      parsedStyles.push({
        name: breakpoint.name,
        styles : []
      })
    }

    styles.forEach((style) => {
      var breakpointIndex = parseInt(style.name.substring(0,2));
      if(breakpointIndex < (settings.breakpoints.length)) {
        parsedStyles[breakpointIndex].styles.push({
          name: style.name,
          fontSize : style.style.fontSize,
          fontFamily: style.style.fontFamily,
          fontWeight: style.style.fontWeight,
          paragraphSpacing: style.style.paragraphSpacing,
          lineHeight: style.style.lineHeight
        })
      }
    })

    // log('parsedStyles')
    // log(parsedStyles[0].styles)

    var compressedStyles = [];
    for(var i = 0; i < parsedStyles[0].styles.length; i++) {
      var minStyle = parsedStyles[0].styles[i];
      log(minStyle)
      var maxStyle = parsedStyles[parsedStyles.length-1].styles[i];
      compressedStyles.push({
        name: minStyle.name.split("/")[1],
        fontSize : {
          min: minStyle.fontSize,
          max: maxStyle.fontSize
        },
        fontFamily: minStyle.fontFamily,
        fontWeight: minStyle.fontWeight,
        paragraphSpacing: minStyle.paragraphSpacing / minStyle.fontSize,
        lineHeight: minStyle.lineHeight / minStyle.fontSize
      })
    }

    log('compressedStyles')
    log(compressedStyles)

    //var parsedStyles = [];
    // styles.foreach((style) => {
    //   parsedStyles.push({
    //     "fontSize" : { "min": 20, "max": 28 },
    //     "lineHeight": 1.125,
    //     "paragraphspacing": 0.25,
    //     "fontWeight": 12,
    //     "fontFamily": "Abril Fatface",
    //     "name": "03 Subhead"
    //   })
    // })



    browserWindow.webContents
      .executeJavaScript(`getSharedTextStyles(${JSON.stringify(compressedStyles)})`)
      .then(res => {})

  })

  const webContents = browserWindow.webContents

  webContents.on('makeTypeScale', props => {

    var document = Document.getSelectedDocument();
    let page = document.selectedPage;

    //log(props)

    getWebview(webviewIdentifier).close();

    props.styles.forEach((style) => {

      for (var i = 0; i < settings.breakpoints.length; i++) {

        var breakpoint = settings.breakpoints[i];

        var min = breakpoint.value;
        var max = settings.breakpoints[i+1]? settings.breakpoints[i+1].value : null;
        var minmax = max? (min + "-" + max + "px") : (min + "px" + "+");

        var size = style.fontSize.min + (style.fontSize.max - style.fontSize.min)*(i/(settings.breakpoints.length-1));

        var textStyle = updateSharedTextStyle({
          name: i.pad(2) + " " + breakpoint.name.toUpperCase() + " " + minmax + "/" + style.name,
          style: {
            fontSize : size,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            paragraphSpacing: style.paragraphSpacing,
            lineHeight: style.lineHeight
          }
        });
      }
    });

    UI.message('Text Styles created successfully.')

  });

  browserWindow.loadURL(require('../resources/' + webViewOptions.webpage))

  function updateSharedTextStyle(textStyle) {

    var document = Document.getSelectedDocument();
    var sharedTextStyle = getSharedTextStyleByName(textStyle.name);

    if(sharedTextStyle) {
      sharedTextStyle.style.fontSize = round(textStyle.style.fontSize);
      sharedTextStyle.style.fontFamily = textStyle.style.fontFamily;
      sharedTextStyle.style.fontWeight = textStyle.style.fontWeight;
      sharedTextStyle.style.paragraphSpacing = round(textStyle.style.paragraphSpacing * textStyle.style.fontSize);
      sharedTextStyle.style.lineHeight = round(textStyle.style.lineHeight * textStyle.style.fontSize);
    } else {
      sharedTextStyle = document.sharedTextStyles.push({
        name: textStyle.name,
        style: {
          fontSize : round(textStyle.style.fontSize),
          fontFamily: textStyle.style.fontFamily,
          fontWeight: textStyle.style.fontWeight,
          paragraphSpacing: round(textStyle.style.paragraphSpacing * textStyle.style.fontSize),
          lineHeight: round(textStyle.style.lineHeight * textStyle.style.fontSize)
        }
      });
    }
    return sharedTextStyle;
  }

  function getSharedTextStyleByName(name) {

    var document = Document.getSelectedDocument();
    var styles = document.sharedTextStyles;

    for(var i = 0; i < styles.length; i++) {
      if(styles[i].name == name) {
        return styles[i];
      }
    }

    return null;
  }

  function renderFontScales() {

    var document = Document.getSelectedDocument();
    var styles = document.sharedTextStyles;
    var _x = 0;

    var parsedStyles = [];
    for(var i = 0; i < settings.breakpoints.length; i++) {
      var breakpoint = settings.breakpoints[i];
      parsedStyles.push({
        name: breakpoint.name,
        styles : []
      })
    }

    styles.forEach((style) => {
      var breakpointIndex = parseInt(style.name.substring(0,2));
      if(breakpointIndex < (settings.breakpoints.length)) {
        parsedStyles[breakpointIndex].styles.push({
          name: style.name,
          fontSize : style.style.fontSize,
          fontFamily: style.style.fontFamily,
          fontWeight: style.style.fontWeight,
          paragraphSpacing: style.style.paragraphSpacing,
          lineHeight: style.style.lineHeight
        })
      }
    })

    for(var i = 0; i < styles.length; i++) {

      var font = styles[i];

      var _y = 0;

      for(var s = 0; s < font.fontSizes.length; s++) {

        var sizes = font.fontSizes[s];
        var group = new Document.Group({ parent: page });

        for(var z = 0; z < sizes.length; z++) {

          var name = styleName(font.type, config.breakpoints[s], z)
          var text = renderTextLayer(group, font, sizes[z], name);

          text.frame.y = _y;
          _y += text.frame.height + config.spacing.y;
        }

        group.adjustToFit();
        group.frame.x = _x;
        _y += config.spacing.y;
      }
      _x += group.frame.width + config.spacing.x;
    }
  }

  const styleName = (type, device, level) => {
    var name = capitalize(type);
    name += "/" + capitalize(device) + "/";
    name += "Level " + (level + 1) + " (" + uppercase(config.labels[level]) + ")";
    var semanticTag = config.markup[type][config.labels[level]];
    if(semanticTag != undefined) {
      name += " — " + uppercase(semanticTag)
    }
    return name;
  }

  const round = (num) => {
    return settings.round? Math.round(num) : num
  }
}


export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
