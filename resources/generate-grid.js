// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

document.getElementById('button').focus();

// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  //window.postMessage('nativeLog', 'Called from the webview')
  var elColumns = document.getElementById('columns');

  window.postMessage('makeGrid', {
    columns : elColumns.options[elColumns.selectedIndex].value,
    gutter : document.getElementById('gutter').checked? true : false,
    gutterSize : document.getElementById('gutterSize').value,
    margin : document.getElementById('margin').checked? true : false,
    marginSize : document.getElementById('marginSize').value
  });
})

// call the wevbiew from the plugin
window.getStoredSettings = (settings) => {

  window.postMessage('nativeLog', settings);

  var elColumns = document.getElementById('columns');

  elColumns.value = settings.columns;
  document.getElementById('gutter').checked = settings.gutter;
  document.getElementById('gutterSize').value = settings.gutterSize;
  document.getElementById('margin').checked = settings.margin;
  document.getElementById('marginSize').value = settings.marginSize;
}
