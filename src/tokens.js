import BrowserWindow from "sketch-module-web-view";
import { getWebview } from "sketch-module-web-view/remote";
import UI from "sketch/ui";
import Document from "sketch/dom";
import Settings from "sketch/settings";
import { Page, Style, SharedStyle } from "sketch/dom";

const webViewOptions = {
  identifier: "intouch-toolkit.tokens",
  webpage: "tokens.html",
  width: 480,
  height: 370,
  show: false,
  title: "Tokens"
};

const defaults = {
  colors: [
    { name: "primary", color: "#B2D236"},
    { name: "secondary", color: "#24B5AC"},
    { name: "tertiary", color: "#076D71"}
  ],
  gradients: [],
  typography: [],
  spacing: []
};

export default function() {
  const document = Document.getSelectedDocument();
  const browserWindow = new BrowserWindow(webViewOptions);
  browserWindow.once("ready-to-show", () => {
    var tokens = getTokens();
    browserWindow.show();
    browserWindow.webContents
      .executeJavaScript(`getTokens(${JSON.stringify(tokens)})`)
      .then(res => {});
  });
  const webContents = browserWindow.webContents;
  webContents.on("updateTokens", tokens => {
    updateTokens(tokens);
    getWebview(webViewOptions.identifier).close();
  });
  webContents.on("nativeLog", s => log(s));
  browserWindow.loadURL(require("../resources/" + webViewOptions.webpage));

  function getTokens() {
    if (Settings.documentSettingForKey(document, "tokens") == undefined) {
      return [defaults];
    } else {
      return [Settings.documentSettingForKey(document, "tokens")];
    }
  }

  function updateTokens(response) {
    var tokens = response.tokens[0];
    document.colors = [];
    tokens.colors.forEach(color => {
      document.colors.push({ color: color.color, name: color.name });
      var existingSharedLayerStyle = document.sharedLayerStyles.filter(
        style => style.name == "color/" + color.name
      );
      log(existingSharedLayerStyle);
      if (existingSharedLayerStyle.length) {
        existingSharedLayerStyle[0].style.fills = [
          { color: color.color, fillType: Style.FillType.Color }
        ];
      } else {
        document.sharedLayerStyles.push({
          name: "color/" + color.name,
          style: {
            fills: [{ color: color.color, fillType: Style.FillType.Color }]
          }
        });
      }
    });

    Settings.setDocumentSettingForKey(document, "tokens", tokens);
    UI.message("Tokens updated successfully.");
  }
}

export function onShutdown() {
  const existingWebview = getWebview(webViewOptions.identifier);
  if (existingWebview) {
    existingWebview.close();
  }
}
