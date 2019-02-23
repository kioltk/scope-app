console.log("Starting electron");
const { app, BrowserWindow, crashReporter } = require("electron");
const bonjour = require("./bonjour");
const receiver = require("../core/receiver");
const server = require("../core/server");
const os = require("os");

app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("ready", () => {
  console.log("Electron app is ready");
  mainWindow = new BrowserWindow({ width: 1360, height: 800 });

  if (process.env.NODE_ENV === "development") {
    const web = "http://localhost:3000/";

    mainWindow.loadURL(web);
    // mainWindow.openDevTools();
    console.log("Loading url");
  } else {
    const file = "file://" + __dirname + "/public/index.html";
    mainWindow.loadURL(file);
    mainWindow.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const addresses = Object.values(os.networkInterfaces())
    .map(network =>
      network.map(
        address =>
          address.family === "IPv4" && !address.internal && address.address
      )
    )
    .flat(1)
    .filter(item => !!item);

  console.log("Found ips on this machine:", addresses);
  const PORT = 43435;

  const socketsAdvertiser = bonjour.advertise(PORT);
  this.clientServer = server.start(PORT + 1);
  this.receivers = addresses.map(HOST =>
    receiver.serve(HOST, PORT, data => {
      this.clientServer.publish(data);
    })
  );
});
