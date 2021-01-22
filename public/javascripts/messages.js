(function(exports){

    exports.GAME_ABORTED_OBJECT = {
        type: "GAME-ABORTED"
    };
    exports.GAME_ABORTED_STRING = JSON.stringify(exports.GAME_ABORTED_OBJECT);
    
    exports.PLAYER_TYPE = "PLAYER-TYPE";
    exports.WHITE_PLAYER_OBJECT = {
      type: exports.PLAYER_TYPE,
      data: "WHITE"
    };
    exports.WHITE_PLAYER_STRING = JSON.stringify(exports.WHITE_PLAYER_OBJECT);

    exports.BLACK_PLAYER_OBJECT = {
        type: exports.PLAYER_TYPE,
        data: "BLACK"
    };
    exports.BLACK_PLAYER_STRING = JSON.stringify(exports.BLACK_PLAYER_OBJECT);

    exports.HAS_MADE_A_MOVE = "HAS-MADE-A-MOVE";
    exports.HAS_MADE_A_MOVE_OBJECT = {
      type: exports.HAS_MADE_A_MOVE,
      data: null
    };
   exports.HAS_MADE_A_MOVE_STRING = JSON.stringify(exports.HAS_MADE_A_MOVE_OBJECT);

   exports.TWO_PLAYERS_TEXT = "TWO PLAYERS ARE IN";
   exports.TWO_PLAYERS_OBJECT = {
     type: exports.TWO_PLAYERS_TEXT,
     data: null
   }
   exports.TWO_PLAYERS_STRING = JSON.stringify(exports.TWO_PLAYERS_OBJECT);

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