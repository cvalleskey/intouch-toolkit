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


document.getElementById('button').addEventListener('click', () => {
  window.postMessage('replaceText', {
    findText : document.getElementById('findText').value,
    replaceText : document.getElementById('replaceText').value
  });
})
