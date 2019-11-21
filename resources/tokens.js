document.addEventListener('contextmenu', (e) => { e.preventDefault() })

document.getElementById('confirm').addEventListener('click', () => {
  var elTokens = document.getElementById('tokens');
  //window.postMessage('nativeLog', "sending tokens");
  window.postMessage('updateTokens', { tokens: JSON.parse(elTokens.value) });
})

window.getTokens = (tokens) => {
  //window.postMessage('nativeLog', "getting tokens");
  //window.postMessage('nativeLog', tokens);
  //if(tokens.length) {
    document.getElementById('tokens').innerHTML = "[" + JSON.stringify(tokens,null,'\t') + "]"
  //}
}
