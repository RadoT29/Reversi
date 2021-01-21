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

var currentgames = {};


setInterval(function() {
  for (let i in currentgames) {
    if (Object.prototype.hasOwnProperty.call(currentgames,i)) {
      let closeGame = currentgames[i];
      //if the closeGame has a final status, the game is complete/aborted
      if (closeGame.finalStatus != null) {
        delete currentgames[i];
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
  currentgames[connected.id] = newGame;

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
      let theGame = currentgames[connected.id];
      let isPlayerWhite;

      if(theGame.WhitePlayer == connected){
        isPlayerWhite = true;
      }else{
        isPlayerWhite = false;
      }
      
      if(isPlayerWhite) {
        if(currentMessage.type == messages.HAS_MADE_A_MOVE) {
          if (theGame.has2Players()) {
            theGame.BlackPlayer.send(message);
            console.log("sending move to black player");
          }
        }else if(currentMessage.type == messages.GAME_WON_BY) {
          theGame.setStatus(currentMessage.data);
          theGame.BlackPlayer.send(JSON.stringify({
            type: messages.GAME_OVER,
              data: currentMessage.data
          }));
          status.finishedGames++;
          theGame.finalStatus = 1;
          console.log(currentMessage.data);
        } else{
          return;
        }
      } else{
        if(currentMessage.type == messages.HAS_MADE_A_MOVE) {
          if (theGame.has2Players()) {
            theGame.WhitePlayer.send(message);
            console.log("sending move to white player");
          }
        }else if(currentMessage.type == messages.GAME_WON_BY) {
          theGame.setStatus(currentMessage.data);
          theGame.WhitePlayer.send(JSON.stringify({
            type: messages.GAME_OVER,
            data: currentMessage.data
          }));
          status.finishedGames++;
          theGame.finalStatus = 1;
          console.log(currentMessage.data);
        } else{
          return;
        }
      }
    });
    
    connected.on("close", function(code){

        console.log(connected.id + " disconnected ...");

        if(code == "1001"){

            let closeGame = currentgames[connected.id];

            if (closeGame.isTransformPossible(closeGame.gameState, "ABORTED")) {
              closeGame.setStatus("ABORTED");
              closeGame.finalStatus = 1;
              closeGame.playerCount--;
              closeGame.playerCount--;

        try {
            closeGame.WhitePlayer.close();
            closeGame.WhitePlayer = null;
          } catch (e) {
            console.log("White Player closing: " + e);
          }
  
          try {
            closeGame.BlackPlayer.close();
            closeGame.BlackPlayer = null;
          } catch (e) {
            console.log("Black Player closing: " + e);
          }
        }

        if(closeGame.isTransformPossible(closeGame.gameState, "0")){
          closeGame.setStatus("0");
          closeGame.playerCount--;
          try {
            closeGame.WhitePlayer.close();
            closeGame.WhitePlayer = null;
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