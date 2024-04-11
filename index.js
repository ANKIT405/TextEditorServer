let express = require("express"); //step1:import express



let Port=5000 

let app = express();
let cors = require("cors");
let http = require("http");
let server = http.createServer(app); // step2:createServer by HTTP module and give the argument app

let io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  methods: ["POST","GET"]
  },
}); //step3:import the socket.io and call and give argument server that was created above

//let's connect the circuitðŸ”²
io.on("connection", (Client) => {
  Client.on("cursor", (pointerVal) => {
    Client.broadcast.emit("pointer", pointerVal);
  });

  Client.on("pointerEnter", () => {
    Client.emit("mouseEnter");
  });

  Client.on("pointerOut", () => {
    Client.emit("mouseOut");
  });

  Client.on("SettingText", () => {
    Client.broadcast.emit("SetText");
  });

  Client.on("textSelect", (text) => {
    io.emit("TextSelect", text);
  });

  Client.on("UserJoined", (UserName) => {
    io.emit("ID", UserName);
    Client.on("MonitorText", () => {
      io.emit("Monitor-text");
    });
  });

  Client.on("FontSize", () => {
    io.emit("fontSize");
  });
});

app.route("/").get((req, res) => {
  res.send("SERVER");
});

server.listen(Port, () => {
  console.log("Server is listening at Port 5000");
});
