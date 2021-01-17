var mygame = function(ID){
    this.id = ID;
    this.WhitePlayer = null;
    this.BlackPlayer = null;
    this.gameState = "0";
    this.possibleMoves = 1;
    this.turn = "WHITE";  
};

mygame.prototype.states = {};
mygame.prototype.states["0"] = 0;
mygame.prototype.states["1"] = 1;
mygame.prototype.states["2"] = 2;
mygame.prototype.states["NO MOVES"] =3;
mygame.prototype.states["WHITE"] = 4; 
mygame.prototype.states["BLACK"] = 5;
mygame.prototype.states["DRAW"] = 6;
mygame.prototype.states["ABORTED"] = 7;

mygame.prototype.transformList = [
  [0, 1, 0, 0, 0, 0, 0], //0 
  [1, 0, 1, 0, 0, 0, 0], //1
  [0, 0, 0, 1, 0, 0, 1], //2 
  [0, 0, 0, 1, 1, 1, 1], //NO MORE MOVES
  [0, 0, 0, 0, 0, 0, 0], //WHITE WON
  [0, 0, 0, 0, 0, 0, 0], //BLACK WON
  [0, 0, 0, 0, 0, 0, 0], //DRAW
  [0, 0, 0, 0, 0, 0, 0] //ABORTED
];

mygame.prototype.isTransformPossible = function(from, to){
    console.assert(
        typeof from == "string",
        "%s: Expecting %s to be a string",
        arguments.callee.name,
        typeof from
    );

    console.assert(
        typeof to == "string",
        "%s: Expecting %s to be a string",
        arguments.callee.name,
        typeof to
    );

    console.assert(
     from in mygame.prototype.states == true,
     "%s: Expecting %s to be a valid transition state",
     arguments.callee.name,
     from
    );

    console.assert(
        to in mygame.prototype.states == true,
        "%s: Expecting %s to be a valid transition state",
        arguments.callee.name,
        to
    );

    let i, j;
    if (!(from in mygame.prototype.states)) {
      return false;
    } else {
      i = mygame.prototype.states[from];
    }
  
    if (!(to in mygame.prototype.states)) {
      return false;
    } else {
      j = mygame.prototype.states[to];
    }

    return mygame.prototype.transformList[i][j] > 0;
;}

mygame.prototype.isStateValid = function(string) {
    return string in mygame.prototype.states;
};

mygame.prototype.has2Players = function(string){
    return this.gameState == "2";
};

mygame.prototype.setStatus = function(newEntry) {

    console.assert(
      typeof newEntry == "string",
      "%s: Expecting a string, got a %s",
      arguments.callee.name,
      typeof newEntry
    );

    if (
        mygame.prototype.isStateValid(newEntry) &&
        mygame.prototype.isTransformPossible(this.gameState, newEntry)
      ) {
        this.gameState = newEntry;
        console.log("[CURRENT GAME STATE] %s", this.gameState);
      } else {
        return new Error(
          "Impossible status change from %s to %s",
          this.gameState,
          newEntry
        );
      }
};

mygame.prototype.addPlayer = function(newPlayer){
    console.assert(
        newPlayer instanceof Object,
        "%s: An object was expected , but %s was received",
        arguments.callee.name,
        typeof newPlayer
    );

    if(this.gameState != "0" && this.gameState != "1"){
        return new Error(
            "A Player cannot be added when the state is %s",
            this.gameState
        );
    };

    var tryOne = this.setStatus("1");
    if(tryOne instanceof Error){
        this.setStatus("2");
    }

    if(this.WhitePlayer == null){
        this.WhitePlayer = newPlayer;
        return "WHITE";
    }else{
        this.BlackPlayer = newPlayer;
        return "BLACK";
    }
};
module.exports = mygame;