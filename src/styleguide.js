/*-------------------------------------------*\

Styleguide
==========

Uses native Sketch features and attributes to export color, gradient,
type, and spacing rules into a design token configuration file.

Features:
- Unopinionated (no naming requirements or special layer setup—just use Sketch)
- Bidirectional (config can update Sketch file or vice versa)

Scenarios:
- From scratch: Generate a base styleguide
- From brand guide: Input attributes and generate extra styles with utility functions
- Edit a style: Make changes using Sketch, then Save
- Add/Remove style: Add using Sketch native features, or regenerate with utility functions

\*-------------------------------------------*/

import UI from 'sketch/ui';
import Document from 'sketch/dom';
import { Page } from 'sketch/dom';

var document = Document.getSelectedDocument();
let page = document.selectedPage;

var settings = {
  colors: {
    spacing: "#FF000022"
  },
  distanceBetweenSpaces: 16
}

var skyriziConfig = {
  colors : [
    { name: "AbbVie Blue", color: "#071d49ff" },
    { name: "Light Blue",  color: "#baecffff" },
    { name: "Blue",  color: "#1ba2daff" },
    { name: "Text",  color: "#29333fff" },
    { name: "Dark Blue", color: "#29333fff" }
  ],
  spacing : [
    { name: "1", value: 4 },
    { name: "2", value: 8 },
    { name: "3", value: 12 },
    { name: "4", value: 16 },
    { name: "5", value: 20 },
    { name: "6", value: 24 },
    { name: "10", value: 40 },
    { name: "12", value: 48 },
    { name: "16", value: 64 },
    { name: "20", value: 80 },
    { name: "24", value: 96 },
    { name: "32", value: 128 },
    { name: "40", value: 160 },
    { name: "48", value: 192 },
    { name: "56", value: 224 },
    { name: "64", value: 256 }
  ],
  textStyles : [
    {
      name: "Heading/Desktop/Level 8 (XXL) — H1",
      fontSize: { min: 2, max: 3.25 },
      font: "Abril Fatface",
      lineHeight: 1.125, // unitless
      marginBottom: 0.5 // taken from paragraphSpacing attribute in Sketch
    },
  ]
}

var baseConfig = {

/*-------------------------------------------*\

Colors & Gradients
==================

Sketch: Native document Colors and Gradients

Description: Map to CSS classes for color, background-color, and border-color.

Naming:
{property}-{name}

property = text, bg (background-color), border
name =

Examples:
- text-base03
- bg-base03
- border-red

\*-------------------------------------------*/

  colors : [
    { name: "Primary", color: "#B2D236FF"},
    { name: "Secondary", color: "#24B5ACFF"},
    { name: "Tertiary", color: "#076D71FF"},

    // { name: "Base03", color: "#002b36FF" },
    // { name: "Base02", color: "#073642FF" },
    // { name: "Base01", color: "#586e75FF" },
    // { name: "Base00", color: "#657b83FF" },
    // { name: "Base0", color: "#839496FF" },
    // { name: "Base1", color: "#93a1a1FF" },
    // { name: "Base2", color: "#eee8d5FF" },
    // { name: "Base3", color: "#fdf6e3FF" },
    // { name: "Yellow", color: "#b58900FF" },
    // { name: "Orange", color: "#cb4b16FF" },
    // { name: "Red", color: "#dc322fFF" },
    // { name: "Magenta", color: "#d33682FF" },
    // { name: "Violet", color: "#6c71c4FF" },
    // { name: "Blue", color: "#268bd2FF" },
    // { name: "Cyan", color: "#2aa198FF" },
    // { name: "Green", color: "#859900FF" }
  ],

  gradients : [
    {
      name: "Green Gradient Linear",
      from: [0.5,0],
      to: [0.5,1],
      stops: [
        { position: 0, value: "#b4ec51ff" },
        { position: 1, value: "#429321ff" }
      ],
      type: "linear"
    },
      {
        name: "Green Gradient Radial",
        from: [0.5,0],
        to: [0.5,1],
        stops: [
          { position: 0, value: "#b4ec51ff" },
          { position: 1, value: "#429321ff" }
        ],
        type: "radial"
      },
  ],

/*-------------------------------------------*\

Spacing
=======

Sketch: TBD. Symbols?

Description: Map to CSS utility classes for margin and padding, with classes
for individual edges, left+right, top+bottom, and all around. Spacing classes
should also allow for their use in specific breakpoints.

Naming:
{property}{sides}{-breakpoint}-{size}

property = m (margin) or p (padding)
sides = t (top), r (right), b (bottom), l (left), x (left+right), y (top+bottom)
breakpoint = s, m, l, xl

Examples:
- p-1 (Padding size 1)
- ml-2 (Margin left size 2)
- ms-lg-2 (Margin size, starting on large devices, size 2)
-

\*-------------------------------------------*/

  spacing : [
    // { name: "0", value: 0 },
    { name: "1", value: 4 },
    { name: "2", value: 8 },
    { name: "3", value: 12 },
    { name: "4", value: 16 },
    { name: "5", value: 20 },
    { name: "6", value: 24 },
    { name: "10", value: 40 },
    { name: "12", value: 48 },
    { name: "16", value: 64 },
    { name: "20", value: 80 },
    { name: "24", value: 96 },
    { name: "32", value: 128 },
    { name: "40", value: 160 },
    { name: "48", value: 192 },
    { name: "56", value: 224 },
    { name: "64", value: 256 }
  ],

  /*-------------------------------------------*\

  Text Styles
  ===========

  Use: Sketch native Text Styles

  Description: Map to CSS utility classes for type, with defaults
  applied to H1-6, P, and other HTML elements where appropriate.

  Naming:
  [text-][name] or [tag]

  Examples:
  - h1, .h1
  - text-caption

  \*-------------------------------------------*/

  textStyles : [
    {
      name: "Heading Level 9 (XXXL)",
      fontSize: { min: 2.5, max: 5 },
      font: "Abril Fatface",
      lineHeight: 1.125, // unitless
      marginBottom: 0.5, // em
      marginTop: 0
    },
    {
      name: "Heading",
      lineHeight: 1.5,
      cssFontWeight: 400,
      sketchFontWeight: 5,
      baseFontSize: 16,
      fontScale: {
        min: [0.75,0.825,1,1.125,1.25,1.5,1.75,2,2.5],
        max: [0.75,0.825,1,1.25,1.5,2,3.25,5]
      }
    }
  ]
}

// Generate = Start from scratch from an existing file

export function generateAll() {

  // Ask for input:
  // - Fonts: Heading and Body
  // - Type scale
  // - Spacing (multiplier?)
  // - Colors

}

export function generateSpacing() {

  var symbolsPage = getSymbolsPage();
  var symbols = document.getSymbols();

  let page = document.selectedPage;

  var group = new Document.Group({
    parent: page,
    name: "Spacing"
  });

  var _x = 0;
  var _y = 0;

  baseConfig.spacing.forEach((space) => {

    // Create the base fill shape
    var shape = new Document.ShapePath({
        name : "Fill",
        frame: {
          x: 0,
          y: 0,
          width: space.value,
          height: space.value
        },
        style: { fills: [settings.colors.spacing] }
    });

    // Create the spacing symbol or update if exists
    var name = "Spacing/Spacing-" + space.name + " (" + space.value + "px)";

    var existingSymbol;
    symbols.forEach((symbol, i) => {
      // log(name + " ? " + symbol.name)
      if(symbol.name.startsWith("Spacing/Spacing-" + space.name + " ")) {
        log('got it: ' + symbol)
        existingSymbol = symbol;
      }
    });

    var attr = {
      name : name,
      layers: [shape],
      parent: symbolsPage,
      frame: {
        x: _x,
        y: _y,
        width: space.value,
        height: space.value
      }
    }

    if(existingSymbol == undefined) {
      var symbol = new Document.SymbolMaster(attr);
    } else {
      symbol = existingSymbol;
      symbol.name = attr.name;
      symbol.layers = attr.layers;
      symbol.frame = attr.frame;
    }

    // Make an instance of the symbol on the current page
    var instance = symbol.createNewInstance();
    instance.parent = group;
    instance.frame = {
      x: _x,
      y: _y,
      width: space.value,
      height: space.value
    }

    _x += space.value + settings.distanceBetweenSpaces

  });

  group.adjustToFit();

  UI.message("Spacing generated");

}

export function generateTypeScale() {

}

/*-------------------------------------------*\

Genereate Colors
================

From a config file,

\*-------------------------------------------*/
export function generateColors() {

  var config = skyriziConfig;

  let page = document.selectedPage;
  var colors = document.colors;

  var group = new Document.Group({
    parent: page,
    name: "Colors"
  });

  var _x = 0;
  var _y = 0;

  config.colors.forEach((color) => {
    var shape = new Document.ShapePath({
        parent: group,
        name : color.name,
        frame: {
          x: _x,
          y: _y,
          width: 80,
          height: 80
        },
        style: { fills: [color.color] }
    });
    _x += 80 + settings.distanceBetweenSpaces;
  });
  group.adjustToFit();

  document.colors = [];
  config.colors.forEach((color) => {
    log(color)
    document.colors.push({
      color: color.color,
      name: color.name
    });
  });

  UI.message("Colors generated");


}

export function generateGradients() {

}

export function getStyleguide() {

  var colors = [];
  document.colors.forEach((item) => {
    colors.push({
      "name" : item.name,
      "color" : item.color
    })
  });

  var gradients = [];
  document.gradients.forEach((item) => {
    gradients.push({
      name: item.name,
      from: item.gradient.from,
      to: item.gradient.to,
      stops: item.gradient.stops,
      type: item.gradient.gradientType
    })
  });

  var textStyles = [];
  document.sharedTextStyles.forEach((item) => {
    textStyles.push({
      "name": item.name,
      "fontSize": item.style.fontSize,
      "font": item.style.fontFamily,
      "lineHeight": item.style.lineHeight,
      "marginBottom": item.style.paragraphSpacing,
      "fontWeight": item.style.fontWeight
    })
  });

  var spacing = [];
  var symbols = document.getSymbols();
  symbols.forEach((symbol, i) => {
      if(symbol.name.startsWith("Spacing/Spacing-")) {
        spacing.push({
          "name" : symbol.name,
          "value" : symbol.frame.width
        })
      }
    });

  var styleguide = {
    "colors" : colors,
    "gradients" : gradients,
    "textStyles" : textStyles,
    "spacing" : spacing
  }

  log(styleguide)
  //UI.alert('my title', JSON.stringify(styleguide))

}

function getSymbolsPage() {
  var symbolsPage = Page.getSymbolsPage(document);
  if(symbolsPage == undefined) {
    symbolsPage = Page.createSymbolsPage();
    symbolsPage.parent = document
  }
  return symbolsPage;
}

function getSpacingSymbol(name) {
  var symbols = document.getSymbols();
  symbols.forEach((symbol, i) => {
    // log(name + " ? " + symbol.name)
    if(symbol.name.startsWith(name)) {
      //log('got it: ' + symbol)
      return symbol;
    }
  })
}
