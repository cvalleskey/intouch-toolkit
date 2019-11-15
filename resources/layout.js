// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  //window.postMessage('nativeLog', 'Called from the webview')
  var elColumns = document.getElementById('columns');
  var elBreakpoint = document.getElementById('breakpoint');

  window.postMessage('doLayout', {
    columns : elColumns.options[elColumns.selectedIndex].value,
    breakpoint : elBreakpoint.options[elBreakpoint.selectedIndex].value,
    margin : document.getElementById('margin').checked,
    outerMargin : document.getElementById('outer-margin').checked,
  });
})
