// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  window.postMessage('nativeLog', 'Called from the webview')
  var elStyleObject = document.getElementById('styleObject');

  //document.getElementById('sharedTextStyles').innerHTML = elStyleObject.value;

  window.postMessage('makeTypeScale', {
    styles : JSON.parse(elStyleObject.value)
  });
})

// call the wevbiew from the plugin
window.setRandomNumber = (randomNumber) => {
  document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
}

window.getSharedTextStyles = (sharedTextStyles) => {
  window.postMessage('nativeLog', sharedTextStyles)
  if(sharedTextStyles.length) {
    document.getElementById('styleObject').innerHTML = JSON.stringify(sharedTextStyles,null,'\t')
  }
}
