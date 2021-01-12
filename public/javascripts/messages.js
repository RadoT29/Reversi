(function(exports){

    exports.GAME_ABORTED_OBJECT = {
        type: "GAME-ABORTED"
    };
    exports.GAME_ABORTED_STRING = JSON.stringify(exports.GAME_ABORTED_OBJECT);

    exports.PLAYER_TYPE = "PLAYER-TYPE";
    exports.WHITE_PLAYER_OBJECT = {
      type: exports.PLAYER_TYPE,
      data: "White"
    };
    exports.WHITE_PLAYER_STRING = JSON.stringify(exports.WHITE_PLAYER_OBJECT);

    exports.BLACK_PLAYER_OBJECT = {
        type: exports.PLAYER_TYPE,
        data: "Black"
    };
    exports.WHITE_PLAYER_STRING = JSON.stringify(exports.BLACK_PLAYER_OBJECT);

    exports.HAS_MADE_A_MOVE = "HAS-MADE-A-MOVE";
    exports.HAS_MADE_A_MOVE_OBJECT = {
      type: exports.HAS_MADE_A_MOVE,
      data: null
    };
    // exports.HAS_MADE_A_MOVE_STRING = JSON.stringify(exports.HAS_MADE_A_MOVE_OBJECT);
    //This will be implemented when I understand how to track the data of the move.

    exports.MAKE_A_MOVE= "MAKE-A-MOVE";
    exports.MAKE_A_MOVE_OBJECT = {
      type: exports.MAKE_A_MOVE,
      data: null
    };
    // exports.MAKE_A_MOVE_STRING = JSON.stringify(exports.MAKE_A_MOVE_STRING);
    //This will be implemented when I understand how to track the data of the move.


  /*
   * Client -> Server : Announces the winner.
   */
    exports.GAME_WON_BY = "GAME-WON-BY";
    exports.GAME_WON_BY_OBJECT = {
      type: exports.GAME_WON_BY,
      data: null
    };

  /*
   * Server -> Client : Announces the end of the game and the result.
   */
  exports.GAME_OVER = "GAME-OVER";
  exports.GAME_OVER_OBJECT = {
    type: exports.GAME_OVER,
    data: null
  };

})(typeof exports === "undefined" ? (this.Messages = {}) : exports);