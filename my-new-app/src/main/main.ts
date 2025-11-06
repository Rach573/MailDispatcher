import { app, BrowserWindow } from "electron";
import path from "node:path";
import { registerIpcHandlers } from "./myRepo/repoIPC";

app.commandLine.appendSwitch("disable-features", "AutofillServerCommunication,AutofillEnableAccountSuggestions");
app.commandLine.appendSwitch("disable-blink-features", "Autofill");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js")
    }
  });
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
});
