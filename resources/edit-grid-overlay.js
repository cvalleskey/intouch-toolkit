document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})
document.getElementById('button').addEventListener('click', () => {
  window.postMessage('editGrid');
})
