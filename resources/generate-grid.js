// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

document.getElementById('button').focus();

// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  //window.postMessage('nativeLog', 'Called from the webview')
  var elColumns = document.getElementById('columns');
  var elBreakpoint = document.getElementById('breakpoint');

  window.postMessage('makeGrid', {
    columns : elColumns.options[elColumns.selectedIndex].value,
    breakpoint : elBreakpoint.options[elBreakpoint.selectedIndex].value,
    gutter : document.getElementById('gutter').checked? true : false,
    gutterSize : document.getElementById('gutterSize').value,
    margin : document.getElementById('margin').checked? true : false,
    marginSize : document.getElementById('marginSize').value
  });
})

// call the wevbiew from the plugin
// window.setRandomNumber = (randomNumber) => {
//   document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
// }
