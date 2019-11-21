document.addEventListener("contextmenu", e => {
  e.preventDefault();
});

document.getElementById("confirm").addEventListener("click", () => {
  var elTokens = document.getElementById("tokens");
  window.postMessage("updateTokens", { tokens: JSON.parse(elTokens.value) });
});

window.getTokens = tokens => {
  document.getElementById("tokens").innerHTML =
    "[" + JSON.stringify(tokens, null, "\t") + "]";
};
