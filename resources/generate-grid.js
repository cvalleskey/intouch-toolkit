// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

document.addEventListener('keypress', function(e) {
  if(e.keyCode == 13) {
    e.preventDefault();
    document.getElementById('button').click();
  }
});

//document.getElementById('button').focus();

// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  //window.postMessage('nativeLog', 'Called from the webview')
  var elColumns = document.getElementById('columns');
  var elGutterUnit = document.getElementById('gutterUnit');
  var elMarginUnit = document.getElementById('marginUnit');

  window.postMessage('makeGrid', {
    columns : elColumns.options[elColumns.selectedIndex].value,
    gutterSize : Number(document.getElementById('gutterSize').value),
    gutterUnit : elGutterUnit.options[elGutterUnit.selectedIndex].value,
    marginSize : Number(document.getElementById('marginSize').value),
    marginUnit : elMarginUnit.options[elMarginUnit.selectedIndex].value
  });
})

// call the wevbiew from the plugin
window.getStoredSettings = (settings) => {

  if(settings.isUpdate) {
    document.getElementById('button').innerText = "Update";
  }

  var elColumns = document.getElementById('columns');
  elColumns.value = settings.columns;

  document.getElementById('gutterSize').value = Number(settings.gutterSize);
  document.getElementById('gutterUnit').value = settings.gutterUnit;

  document.getElementById('marginSize').value = Number(settings.marginSize);
  document.getElementById('marginUnit').value = settings.marginUnit;
}
