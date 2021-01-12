var express = require("express");
var http = require("http");
var WebSocket = require("ws");

var router = require("./routes/index");
var messages = require("./public/javascripts/messages");

var status = require("./Stats");
var Game = require("./game");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
app.get("/play_game", router);

app.use("/", (req, res) =>{
    res.sendFile("/University/Y1/Q2/WDT/WEB/2/myapp/public/splash.html",{
        startedGames: status.startedGames,
        finishedGames: status.finishedGames
      });
});

const server =  http.createServer(app);
const wss = new WebSocket.Server({ server }); 

var websockets = {};




var newGame = new Game(status.startedGames++);
var connectionID = 0;


wss.on("connection", function(ws){
  let connected = ws;
  connected.id = connectionID++;
  let player = newGame.addPlayer(connected);
  websockets[connected.id] = newGame;

  console.log(
    "Player %s is placed in game %s as %s",
    connected.id,
    newGame.id,
    player
  );
    
    connected.send(player == "WHITE" ? messages.WHITE_PLAYER_STRING : messages.BLACK_PLAYER_STRING);

    if(newGame.has2Players()){
        newGame = new Game(status.startedGames++);
    }

    connected.on("close", function(code){
        console.log(connected.id + " disconnected ...");

        if(code == "1001"){
            let gameObj = websockets[connected.id];

            if (gameObj.isTransformPossible(gameObj.gameState, "ABORTED")) {
            gameObj.setStatus("ABORTED");

        try {
            gameObj.WhitePlayer.close();
            gameObj.WhitePlayer = null;
          } catch (e) {
            console.log("White Player closing: " + e);
          }
  
          try {
            gameObj.BlackPlayer.close();
            gameObj.BlackPlayer = null;
          } catch (e) {
            console.log("Black Player closing: " + e);
          }
        }
        }
    });
});

server.listen(port, () =>{
    console.log("Server started on port: %s", port);
}); 