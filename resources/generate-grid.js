// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

//document.getElementById('button').focus();

// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  window.postMessage('nativeLog', 'Called from the webview')
  // var elColumns = document.getElementById('columns');
  //
  // window.postMessage('makeGrid', {
  //   columns : elColumns.options[elColumns.selectedIndex].value,
  //   gutter : true,
  //   gutterSize : Number(document.getElementById('gutterSize').value),
  //   margin : true,
  //   marginSize : Number(document.getElementById('marginSize').value)
  // });
})

// call the wevbiew from the plugin
window.getStoredSettings = (settings) => {

  return "yay";

  //window.postMessage('nativeLog', settings);

  // var elColumns = document.getElementById('columns');
  //
  // elColumns.value = settings.columns;
  // //document.getElementById('gutter').checked = settings.gutter;
  //
  // if(settings.gutterSize.includes('%')) {
  //   document.getElementById('gutterSize').value = '%';
  // }
  // document.getElementById('gutterSize').value = parseInt(settings.gutterSize, 10);
  //
  // //document.getElementById('margin').checked = settings.margin;
  // if(settings.marginSize.includes('%')) {
  //   document.getElementById('marginSize').value = '%';
  // }
  // document.getElementById('marginSize').value = parseInt(settings.marginSize, 10);
}
