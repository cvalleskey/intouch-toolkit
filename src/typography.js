import UI from 'sketch/ui';
import Document from 'sketch/dom';

var document = Document.getSelectedDocument();
let page = document.selectedPage;

var config = {
  base : "m",
  labels: ["xxxl","xxl","xl","l","m","s","xs","xxs","xxxs"],
  markup: {
    heading: { xxl: "h1", xl: "h2", l: "h3", m: "h4", s: "h5", xs: "h6"
    },
    body: { m: "p", }
  },
  spacing: { y : 16, x : 64 }
}

var settings = {
  minFontSize: 12,
  baseFontSize: 16,
  fonts: [
    {
      type: "body",
      fontFamily: "Open Sans",
      lineHeight: 1.5,
      cssFontWeight: 400,
      sketchFontWeight: 5,
      scale : [1.125, 1.25],
      margin: 0.5

    },
    {
      type: "heading",
      fontFamily: "Abril Fatface",
      lineHeight: 1.125,
      cssFontWeight: 400,
      sketchFontWeight: 12,
      scale : [1.25, 1.5],
      margin: 0.25
    }
  ],
  round: true
}

export function updateFontScales() {

  for(var i = 0; i < settings.fonts.length; i++) {

    var font = settings.fonts[i];

    font.minFontSize = generateFontScale(font.scale[0]);
    font.maxFontSize = generateFontScale(font.scale[1]);

  }

  renderFontScales();
  updateSharedTextStyles();

}

function updateSharedTextStyles() {
  for(var i = 0; i < settings.fonts.length; i++) {
    var font = settings.fonts[i];
    generateSharedTextStyles(font, font.minFontSize, capitalize(font.type) + '/Mobile');
    generateSharedTextStyles(font, font.maxFontSize, capitalize(font.type) + '/Desktop');
  }
}

function generateSharedTextStyles(font, scale, label) {
  for(var s = 0; s < scale.length; s++) {

    var semanticTag = config.markup[font.type][config.labels[s]];
    var name = styleName(label, s, semanticTag);
    //log(name)

    var size = scale[(scale.length - 1) - s]; // flip the order
    var sharedTextStyle = getSharedTextStyleByName(name);

    if(sharedTextStyle) {
      //log("it exists")
      //log(name)
      //updateSharedTextStyle();
      sharedTextStyle.style.fontSize = round(size);
      sharedTextStyle.style.fontFamily = font.fontFamily;
      sharedTextStyle.style.fontWeight = font.sketchFontWeight;
      sharedTextStyle.style.paragraphSpacing = round(font.margin * size);
      sharedTextStyle.style.lineHeight = round(font.lineHeight * size);
    } else {
      //log("it does not exist");
      //log(name)
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
      //sharedTextStyle.style.lineHeight = round(font.lineHeight * size);
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

  var baseLabel = Math.floor(config.labels.length/2-1);
  var scaleArray = [];

  for(var i = 0; i < config.labels.length; i++) {
    var fontSize = settings.baseFontSize * Math.pow(scale, i - baseLabel);
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

    var minGroup = new Document.Group({
      parent: page
    });

    for(var s = font.minFontSize.length-1; s >= 0; s--) {
      var text = renderTextLayer(minGroup, font, font.minFontSize[s], s+1, 'min');
      text.frame.y = _y;
      _y += text.frame.height + config.spacing.y;
    }

    minGroup.adjustToFit();
    minGroup.frame.x = _x;
    _x += minGroup.frame.width + config.spacing.x;

    var maxGroup = new Document.Group({
      parent: page
    });

    var _y = 0;

    for(var s = font.maxFontSize.length-1; s >= 0; s--) {
      var text = renderTextLayer(maxGroup, font, font.maxFontSize[s], s+1, 'max');
      text.frame.y = _y;
      _y += text.frame.height + config.spacing.y;
    }

    maxGroup.adjustToFit();
    maxGroup.frame.x = _x;
    _x += maxGroup.frame.width + config.spacing.x;
  }

}

function renderTextLayer(parent, font, size, level, label) {
  var text = new Document.Text({
    parent: parent,
    text: capitalize(font.type + ' level ' + level) + "(" + label + ")",
    style : {
      fontSize : round(size),
      fontFamily: font.fontFamily,
      fontWeight: font.sketchFontWeight,
      paragraphSpacing: round(font.margin * size)
    }
  });
  text.style.lineHeight = round(font.lineHeight * size); // this must be set after Text layer is created
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

const styleName = (type,level,tag) => {
  var name = capitalize(type) + "/" + "Level " + (level + 1) + " (" + uppercase(config.labels[level]) + ")";
  if(tag != undefined) {
    name += " — " + uppercase(tag)
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
