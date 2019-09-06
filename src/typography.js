import UI from 'sketch/ui';
import Document from 'sketch/dom';

var document = Document.getSelectedDocument();
let page = document.selectedPage;

var config = {
  labels: ["xxxs","xxs","xs","s","m","l","xl","xxl","xxxl"],
  markup: {
    heading: { xxl: "h1", xl: "h2", l: "h3", m: "h4", s: "h5", xs: "h6"
    },
    body: { m: "p", }
  },
  spacing: { y : 16, x : 64 },
  viewport: {
    min: 600,
    max: 1200
  },
  breakpoints: ["mobile", "desktop"],
  baseScale: 4
}


// Example settings for now, will replace with a UI soon
var settings = {
  minFontSize: 12,
  baseFontSize: 16,
  fonts: [
    {
      type: "body",
      fontFamily: "Univers LT Std",
      lineHeight: 1.5,
      cssFontWeight: 400,
      sketchFontWeight: 5,
      scale : [1.125, 1.25],
      margin: 0.5
    },
    {
      type: "heading",
      fontFamily: "Univers LT Std",
      lineHeight: 1.125,
      cssFontWeight: 400,
      sketchFontWeight: 12,
      scale : [1.25, 1.5],
      margin: 0.5
    }
  ],
  round: true
}

export function updateFontScales() {

  for(var i = 0; i < settings.fonts.length; i++) {
    var font = settings.fonts[i];
    font.fontSizes = [];
    for(var s = 0; s < font.scale.length; s++) {
      font.fontSizes.push(generateFontScale(font.scale[s]));
    }
  }

  updateSharedTextStyles();
  renderFontScales();

  //outputCSSClasses();

}

function outputCSSClasses() {
  for(var i = 0; i < settings.fonts.length; i++) {

  }
}

function updateSharedTextStyles() {
  for(var i = 0; i < settings.fonts.length; i++) {
    var font = settings.fonts[i];

    for(var s = 0; s < font.fontSizes.length; s++) {

      var sizes = font.fontSizes[s];

      for(var z = 0; z < sizes.length; z++) {

        var size = sizes[z]; // flip the order
        var name = styleName(font.type, config.breakpoints[s], z)
        var sharedTextStyle = getSharedTextStyleByName(name);
        if(sharedTextStyle) {
          sharedTextStyle.style.fontSize = round(size);
          sharedTextStyle.style.fontFamily = font.fontFamily;
          sharedTextStyle.style.fontWeight = font.sketchFontWeight;
          sharedTextStyle.style.paragraphSpacing = round(font.margin * size);
          sharedTextStyle.style.lineHeight = round(font.lineHeight * size);
        } else {
          sharedTextStyle = document.sharedTextStyles.push({
            name: name,
            style: {
              fontSize : round(size),
              fontFamily: font.fontFamily,
              fontWeight: font.sketchFontWeight,
              paragraphSpacing: round(font.margin * size),
              lineHeight: round(font.lineHeight * size)
            }
          });
        }
      }
    }
  }
}

function getSharedTextStyleByName(name) {

  var styles = document.sharedTextStyles;

  for(var i = 0; i < styles.length; i++) {
    if(styles[i].name == name) {
      return styles[i];
    }
  }

  return null;
}

function generateFontScale(scale) {

  var scaleArray = [];

  for(var i = 0; i < config.labels.length; i++) {
    var fontSize = settings.baseFontSize * Math.pow(scale, i - config.baseScale);
    if(fontSize < settings.minFontSize) {
      fontSize = settings.minFontSize;
    }
    scaleArray.push(fontSize);
  }

  return scaleArray;
}

function renderFontScales() {

  var _x = 0;

  for(var i = 0; i < settings.fonts.length; i++) {

    var font = settings.fonts[i];

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

//function renderTextLayer(parent, font, size, level, label) {
function renderTextLayer(parent, font, size, label) {

  var sharedTextStyle = getSharedTextStyleByName(label);

  var text = new Document.Text({
    parent: parent,
    text: label,
    style : {
      fontSize : round(size),
      fontFamily: font.fontFamily,
      fontWeight: font.sketchFontWeight,
      paragraphSpacing: round(font.margin * size),
      lineHeight: round(font.lineHeight * size)
    },
    sharedStyleId: sharedTextStyle.id
  });
  text.style.lineHeight = round(font.lineHeight * size); // this must be set after Text layer is created
  //text.sharedStyleId = sharedTextStyle.id;
  return text;
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const uppercase = (s) => {
  if (typeof s !== 'string') return ''
  return s.toUpperCase()
}

const round = (num) => {
  return settings.round? Math.round(num) : num
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

//
// Original Sass mixin:
//
// @mixin font-size($size) {
//
//   $min-font-size: strip-unit(map-get($size, 'min') * $t-default);
//   $max-font-size: strip-unit(map-get($size, 'max') * $t-default);
//
//   & {
//     font-size: #{map-get($size, 'min')}rem;
//     @media screen and (min-width: $vw-min) {
//       font-size: calc(#{$min-font-size}px + #{strip-unit($max-font-size - $min-font-size)} * ((100vw - #{$vw-min}) / #{strip-unit($vw-max - $vw-min)}));
//     }
//     @media screen and (min-width: $vw-max) {
//       font-size: #{map-get($size, 'max')}rem;
//     }
//   }
// }

// /* Type scale */
// $t-default: 16px;
// $t-9: ("min": 4, "max": 10);
// $t-8: ("min": 3, "max": 6);
// $t-7: ("min": 2.5, "max": 4);
// $t-6: ("min": 1.75, "max": 2.5);
// $t-5: ("min": 1.5, "max": 1.75);
// $t-4: ("min": 1.25, "max": 1.5);
// $t-3: ("min": 1, "max": 1.25);
// $t-2: ("min": 0.875, "max": 1);
// $t-1: ("min": 0.75, "max": 0.875);
