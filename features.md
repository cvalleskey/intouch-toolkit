# Features

## Grid

- Generate a grid based on established responsive CSS grids for pixel-perfect column and margin rendering.

## Padding

- Generate shapes which define the inner padding for elements within a group.

## Typographic Scale (to-do)

- Generate text styles for headers and body text from a set of configuration properties that can easily be translated into CSS.

## Auto Superscript

- Continuously looks for usage of the ^ symbol in selected text layers and converts any text following it into superscript. When editing text, the caret becomes visible again for easy editing. Supports symbol overrides.

Notes:
- To make this work with text styles, it will need to listen for any update to a shared text style. Before a text style changes, it should loop through all text layers and store what portions of the string were superscripted. After the text style updates, then the plugin will go back in and reapply the superscripts, making any adjustments to the font size and baseline as necessary.

## Export to PDF from JPGs

- Generate PDFs by first exporting each artboard as a JPG and then placing it into a PDF. Useful when Sketch's built-in PDF export feature produces glitches.
