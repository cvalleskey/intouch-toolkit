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

var defaultTabStops = [16,32,48,64,80,96,112,128,144,160,176,192,208];

document.getElementById('button').addEventListener('click', () => {

  var tabStopsArray = [];
  defaultTabStops.forEach((stop, i) => {
    tabStopsArray.push(parseInt(document.getElementById('tabInterval' + i).value) || defaultTabStops[i])
  });
  // var tabStopsArray = [
  //   parseInt(document.getElementById('tabInterval0').value) || defaultTabStops[0],
  //   parseInt(document.getElementById('tabInterval1').value) || defaultTabStops[1],
  //   parseInt(document.getElementById('tabInterval2').value) || defaultTabStops[2],
  //   parseInt(document.getElementById('tabInterval3').value) || defaultTabStops[3],
  //   parseInt(document.getElementById('tabInterval4').value) || defaultTabStops[4],
  //   parseInt(document.getElementById('tabInterval5').value) || defaultTabStops[5],
  //   parseInt(document.getElementById('tabInterval6').value) || defaultTabStops[6],
  //   parseInt(document.getElementById('tabInterval7').value) || defaultTabStops[7],
  //   parseInt(document.getElementById('tabInterval8').value) || defaultTabStops[8],
  //   parseInt(document.getElementById('tabInterval9').value) || defaultTabStops[9],
  //   parseInt(document.getElementById('tabInterval10').value) || defaultTabStops[10],
  //   parseInt(document.getElementById('tabInterval11').value) || defaultTabStops[11],
  //   parseInt(document.getElementById('tabInterval12').value) || defaultTabStops[12]
  // ]
  window.postMessage('update', { tabStops: tabStopsArray });
})

document.getElementById('autoStop').addEventListener('click', () => {
  defaultTabStops.forEach((stop, i) => {
    document.getElementById('tabInterval' + i).value = Math.round((16 * i * (window.fontSize / 16)) + window.fontSize);
  })
})

window.setValues = (obj) => {
  // window.postMessage('nativeLog', 'nativeLog');
  // window.postMessage('nativeLog', obj.tabStops);
  var tabStops = obj.tabStops.split(',')
  tabStops.forEach((stop, i) => {
    document.getElementById('tabInterval' + i).value = Number(stop);
  });
  window.fontSize = obj.fontSize || 16;
}
