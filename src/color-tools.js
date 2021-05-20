var sketch = require('sketch')
var document = sketch.getSelectedDocument()
var selectedLayers = document.selectedLayers
var ShapePath = require('sketch/dom').ShapePath

var colorsArray = [];
selectedLayers.forEach(function(layer) { colorsArray.push(hexToHSL(layer.style.fills[0].color)) })

var steps = 5,
    _x = 0,
    _size = 100;

for(var i = 0; i < steps; i++) {
  var shape = new ShapePath({
    type: ShapePath.ShapeType.Rectangle,
    style: {
      fills: [{ color: getColorBetween(colorsArray[0], colorsArray[1], i / (steps - 1)) }],
    },
    frame: {
      x: _x + i * _size,
      y: 0,
      width: _size,
      height: _size
    },
    parent: document.selectedPage
  })
}

function getColorBetween(c1,c2,amount) {
  var color = [
    c1[0] + (c2[0] - c1[0]) * amount,
    c1[1] + (c2[1] - c1[1]) * amount,
    c1[2] + (c2[2] - c1[2]) * amount
  ];

  return HSLToHex(color);
}

function hexToHSL(hex) {
  if(hex.length > 6) {
    hex = hex.substring(0, 7);
  }

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
      h = s = 0; // achromatic
  } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  s = s*100;
  l = l*100;
  h = 360*h;

  return [h,s,l];
}

function HSLToHex(hsl) {
  var h = hsl[0], s = hsl[1], l = hsl[2];
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}
