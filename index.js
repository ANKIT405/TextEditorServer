let cors = require("cors");
let express = require("express"); //step1:import express

// let hostname=0.0.0.0

  let Port=8565

let app = express();
let http = require("http");
let server = http.createServer(app); // step2:createServer by HTTP module and give the argument app
app.use(cors())
let io = require("socket.io")(server, {
  cors: {
    origin: "*",
     methods: ["GET", "POST"],
    headers: ["my-custom-header"],
    
 
  },
}); //step3:import the socket.io and call and give argument server that was created above

//let's connect the circuit
io.on("connection", (Client) => {
  const transport = Client.conn.transport.name;

 Client.conn.on("upgrade", () => {
    const upgradedTransport = Client.conn.transport.name;
  });
  
  Client.on("cursor", (pointerVal) => {
    Client.broadcast.emit("pointer", pointerVal);
  });

  Client.on("pointerEnter", () => {
    Client.emit("mouseEnter");
  });

  Client.on("pointerOut", () => {
    Client.emit("mouseOut");
  });

  Client.on("SettingText", (Get_Text) => {
    Client.broadcast.emit("SetText",Get_Text);
  });

  Client.on("textSelect", (text) => {
    Client.broadcast.emit("TextSelect", text);
  });

  Client.on("UserJoined", (UserName) => {
    io.emit("ID", UserName);
    Client.on("MonitorText", (Editor) => {
      Client.broadcast.emit("Monitor-text",Editor);
    });
  });

  Client.on("FontSize", () => {
    io.emit("fontSize");
  });
});

app.route("/").get((req, res) => { 
  res.send("SERVER");
});

server.listen(Port);
