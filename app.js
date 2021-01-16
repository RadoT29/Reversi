var express = require("express");
var http = require("http");
var WebSocket = require("ws");

var router = require("./routes/index");
var messages = require("./public/javascripts/messages");

var status = require("./Stats");
var Game = require("./game");
const { playerCount } = require("./Stats");
const { connect } = require("./routes/index");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

app.get("/play", router);

app.get("/", (req, res) =>{
    res.render("splash.ejs",{
        startedGames: status.startedGames,
        finishedGames: status.finishedGames,
        playerCount: status.playerCount
      });
});

const server =  http.createServer(app);
const wss = new WebSocket.Server({ server }); 

var websockets = {};


setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);

var newGame = new Game(status.startedGames++);
var connectionID = 0;



wss.on("connection", function connection(ws){

  let connected = ws;
  connected.id = connectionID++;
  let player = newGame.addPlayer(connected);
  status.playerCount++;
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

    connected.on("message", function(message){
      let currentMessage = JSON.parse(message);
      let theGame = websockets[connected.id];
      let isPlayerWhite = theGame.WhitePlayer == connected ? true : false;
  
      if (isPlayerWhite) {
        if (currentMessage.type == messages.HAS_MADE_A_MOVE) {
          if (theGame.hasTwoConnectedPlayers()) {
            theGame.BlackPlayer.send(message);
          }
        }

        if (currentMessage.type == messages.GAME_WON_BY) {
          theGame.setStatus(currentMessage.data);
          gameStatus.finishedGames++;
        }
      } else {
        if (currentMessage.type == messages.HAS_MADE_A_MOVE) {
          if (theGame.hasTwoConnectedPlayers()) {
            theGame.WhitePlayer.send(message);
          }
        }
     
        if (currentMessage.type == messages.GAME_WON_BY) {
          theGame.setStatus(currentMessage.data);
          gameStatus.finishedGames++;
        }
      }
    });
    


    connected.on("close", function(code){

        console.log(connected.id + " disconnected ...");

        if(code == "1001"){

            let gameObj = websockets[connected.id];

            if (gameObj.isTransformPossible(gameObj.gameState, "ABORTED")) {
              gameObj.setStatus("ABORTED");
              gameObj.playerCount--;

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

        if(gameObj.isTransformPossible(gameObj.gameState, "0")){
          gameObj.setStatus("0");
          gameObj.playerCount--;
          try {
            gameObj.WhitePlayer.close();
            gameObj.WhitePlayer = null;
          } catch (e) {
            console.log("White Player closing: " + e);
          }
        }
        }
    });  
});
 



server.listen(port, () =>{
    console.log("Server started on port: %s", port);
}); 