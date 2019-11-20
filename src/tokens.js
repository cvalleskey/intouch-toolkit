import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import Document from 'sketch/dom'

const webViewOptions = {
  identifier: 'intouch-toolkit.tokens',
  webpage: "tokens.html",
  width: 480,
  height: 370,
  show: false,
  title: 'Tokens'
}

export default function () {

  log('wtf')

  const browserWindow = new BrowserWindow(webViewOptions);
  browserWindow.once('ready-to-show', () => {
    var tokens = getToken();
    browserWindow.webContents.executeJavaScript(`getTokens(${JSON.stringify(tokens)})`)
    browserWindow.show()
  })
  const webContents = browserWindow.webContents;

  webContents.on('updateTokens', props => updateTokens(props));

  browserWindow.loadURL(require('../resources/' + webViewOptions.webpage))

  function getTokens() {
    if(Settings.documentSettingForKey(document, 'tokens') == undefined) {
      return [];
    } else {
      return Settings.documentSettingForKey(document, 'tokens');
    }
  }

  function updateTokens(tokens) {

    var document = Document.getSelectedDocument();
    var styles = document.sharedTextStyles;

    for(var i = 0; i < styles.length; i++) {
      if(styles[i].name == name) {
        return styles[i];
      }
    }

    UI.message('Text Styles created successfully.')
    getWebview(webViewOptions.identifier).close();

    return null;
  }

}

export function onShutdown() {
  const existingWebview = getWebview(webViewOptions.identifier)
  if (existingWebview) {
    existingWebview.close()
  }
}
