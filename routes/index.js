var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.sendFile('splash.html', { root: "./public"});
});

router.get('/play_game', function(req, res){
  res.sendFile('game.html',{ root: "./public"});
});

module.exports = router;
