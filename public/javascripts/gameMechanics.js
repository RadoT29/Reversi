var boardArray = [];
var direction = [];
var predictions = [];
var counter = 1;
var colorOfPlayer;
var blackScore = document.getElementById("black-score");
var whiteScore = document.getElementById("white-score");

var newBoardArray = function(){
     boardArray = [];
    for(var i=0; i<8; i++){
      var tempArray = [];
      for(var j=0; j<8; j++){
        tempArray.push(null);
      }
      boardArray.push(tempArray);
    }
 };

 var createBoardHtml = function(){
    var container = document.querySelector("#center");
    var boardContainer = document.createElement("div");
	boardContainer.setAttribute("class", "main-board");
	var boardFrame = document.createElement("div");
	boardFrame.setAttribute("class", "board-frame");

	// markers
	var boardHMarkersContainer = document.createElement("div");
	boardHMarkersContainer.setAttribute("class", "h-markers-container");

	for (var i = 0; i < 8; i++) {
		var boardHMarkers = document.createElement("div");
		boardHMarkers.setAttribute("class", "h-markers");
		boardHMarkersContainer.appendChild(boardHMarkers);
		boardHMarkers.innerHTML = i + 1;
	}

	var boardVMarkersContainer = document.createElement("div");
	boardVMarkersContainer.setAttribute("class", "v-markers-container");

	for (var i = 0; i < 8; i++) {
		var boardVMarkers = document.createElement("div");
		boardVMarkers.setAttribute("class", "v-markers");
		boardVMarkersContainer.appendChild(boardVMarkers);
		boardVMarkers.innerHTML = String.fromCharCode(65 + i);
	}

	var squareColorCounter = 0;

	for (var i = 0; i < 8; i++) {
		var row = document.createElement("div");
		row.setAttribute("class", "row");
		squareColorCounter++;
		for (var j = 0; j < 8; j++) {
			var square = document.createElement("div");
			square.setAttribute("class", "col square squareCell");
			squareColorCounter++;
			row.appendChild(square);
		}
		boardContainer.appendChild(row);
	}
	boardFrame.appendChild(boardContainer);
	boardFrame.appendChild(boardHMarkersContainer);
	boardFrame.appendChild(boardVMarkersContainer);
	container.appendChild(boardFrame);
 }
  
var placeStartingDisks = function(){
    var beg = 27;
    var end = 36
    var colour = 0;
    for(var i=beg; i<29; i++){
      var file = document.getElementById(i);
      var xValue = parseInt(file.getAttribute("horizontal"));
          var yValue = parseInt(file.getAttribute("vertical"));
      var disk = document.createElement("div");
      if (colour % 2 === 0) {
              disk.setAttribute("class", "white-tiles");
        boardArray[yValue][xValue] = "W";
        
          } else {
              disk.setAttribute("class", "black-tiles");
        boardArray[yValue][xValue] = "B";
            }
          file.appendChild(disk);
          file.removeEventListener("click", addDisk);
  
          colour++;
    }
  
    for(var i=end; i>34; i--){
      var file = document.getElementById(i);
      var xValue = parseInt(file.getAttribute("horizontal"));
          var yValue = parseInt(file.getAttribute("vertical"));
      var disk = document.createElement("div");
      if (colour % 2 === 0) {
              disk.setAttribute("class", "white-tiles");
              boardArray[yValue][xValue] = "W";
          } else {
              disk.setAttribute("class", "black-tiles");
              boardArray[yValue][xValue] = "B";
          }
          file.appendChild(disk);
          file.removeEventListener("click", addDisk);
  
          colour++;
    }
    
  }
  
var InitializeBoard = function(){
    createBoardHtml();
    var id = 0;
      var files = document.querySelectorAll('.col');
          for (i = 0; i < 8; i++) {
             for (j = 0; j < 8; j++) {
              files[id].setAttribute("horizontal", j);
              files[id].setAttribute("vertical", i);
              files[id].setAttribute("id", id);
              files[id].addEventListener("click", addDisk);
              id++;
             }
          }   
    newBoardArray();
    placeStartingDisks();
  }

var diskCounting = function () {
	var whiteCount = 0;
	var blackCount = 0;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (boardArray[i][j] === "W") {
                whiteCount += 1;
            }else if (boardArray[i][j] === "B"){
                blackCount += 1;
            }
		}
	}
	blackScore.innerHTML = blackCount;
	whiteScore.innerHTML = whiteCount;
};

const getFiles = (x, y) => {
	const files = document.querySelectorAll(".squareCell");

	for (let i = 0; i < files.length; i++) {
		let file = files[i];

		let xValue = Number(file.getAttribute("horizontal"));
		let yValue = Number(file.getAttribute("vertical"));

		if (xValue === x && yValue === y) {
			return file;
		}
	}
};

var addDisk = (event, socketData = null) => {
	let xValue, yValue, getSym, target;

  if(!socketData) {
		event instanceof Element ? (target = event) : (target = event.target);

		xValue = parseInt(target.getAttribute("horizontal"));
		yValue = parseInt(target.getAttribute("vertical"));
		getSym = counter % 2 === 0 ? "W" : "B";
  }else{
		xValue = socketData.message.x;
		yValue = socketData.message.y;
		getSym = socketData.message.sym;
		target = getFiles(xValue, yValue);
		console.log("target gotten = ", target);
  }
  
  if (!socketData) {
		if (colorOfPlayer !== getSym) {
			console.log("It is not your turn");
		return;
	}
	}

  console.log("event getx, gety, getsym, target", xValue, yValue, getSym);
  
	if (checkOKtoPlace(getSym, xValue, yValue)) {
		removePredictionDots();

		var disk = document.createElement("div");
		target.classList.add("test");

		if (getSym === "W") {
			disk.setAttribute("class", "white-tiles");
			boardArray[yValue][xValue] = getSym;
		} else {
			disk.setAttribute("class", "black-tiles");
			boardArray[yValue][xValue] = getSym;
		}
		changeRespectiveDisks(target, getSym, xValue, yValue);

		counter++;

		target.appendChild(disk);
		target.removeEventListener("click", addDisk);

			console.log(target);
			ws.send(
				JSON.stringify({
					type: Messages.HAS_MADE_A_MOVE,
					data: "playedMove",
					message: { sym: getSym, x: xValue, y: yValue }
				})
			);
		diskCounting();
		getSym = counter % 2 === 0 ? "W" : "B";

		console.log(getSym + "turn");
		var slots = checkSlots(getSym);

		if (slots.empty > 0) {
			if (slots.movable > 0) {
				console.log(getSym + "still can place a disk");
        		predictionDots(getSym);
			} else {
				console.log(getSym + "no place to place a disk, pass");
				counter++;
				getSym = counter % 2 === 0 ? "W" : "B";
				console.log(getSym + "turn");
				var slots = checkSlots(getSym);
				if (slots.movable > 0) {
					predictionDots(getSym);
				} else {
					console.log(getSym + "also cannot place a disk, end game ");
					tempStopAllClicks();
					checkWin();
				}
			}
		} else {
			console.log(getSym + "cannot place a move");
			tempStopAllClicks();
			checkWin();
		}
	} else {
		console.log("Invalid Move");
	}
};

var checkOKtoPlace = function (sym, x, y) {
	var arr = [
		checkTopLeft(sym, x, y),
		checkTop(sym, x, y),
		checkTopRight(sym, x, y),
		checkRight(sym, x, y),
		checkBottomRight(sym, x, y),
		checkBottom(sym, x, y),
		checkBottomLeft(sym, x, y),
		checkLeft(sym, x, y)
	];

	direction = arr;

	if (arr.includes(true)) {
		return true;
	} else {
		return false;
	}
};

//check top left
var checkTopLeft = function (sym, x, y) {
	if (x < 2 || y < 2) {
		return false;
	} else {
		if (boardArray[y - 1][x - 1] !== null) {
			if (boardArray[y - 1][x - 1] !== sym) {
				var minCount = Math.min(x, y) + 1;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y - i][x - i] === sym) {
						return true;
					} else if (boardArray[y - i][x - i] === null) {
						return false;
					} else if (boardArray[y - i][x - i] === undefined) {
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};
//check top
var checkTop = function (sym, x, y) {
	if (y < 2) {
		return false;
	} else {
		if (boardArray[y - 1][x] !== null) {
			if (boardArray[y - 1][x] !== sym) {
				var minCount = y + 1;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y - i][x] === sym) {
						return true;
					} else if (boardArray[y - i][x] === null) {
						return false;
					} else if (boardArray[y - i][x] === undefined) {
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};
//check top right
var checkTopRight = function (sym, x, y) {
	if (y < 2 || x > 8 - 3) {
		return false;
	} else {
		if (boardArray[y - 1][x + 1] !== null) {
			if (boardArray[y - 1][x + 1] !== sym) {
				var minCount = Math.min(8 - x - 1, y) + 1;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y - i][x + i] === sym) {
						return true;
					} else if (boardArray[y - i][x + i] === null) {
						return false;
					} else if (boardArray[y - i][x + i] === undefined) {
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};
//check right
var checkRight = function (sym, x, y) {
	if (x > 8 - 3) {
		return false;
	} else {
		if (boardArray[y][x + 1] !== null) {
			if (boardArray[y][x + 1] !== sym) {
				var minCount = 8 - x;
				for (i = 2; i < 8; i++) {
					if (boardArray[y][x + i] === sym) {
						return true;
					} else if (boardArray[y][x + i] === null) {
						return false;
					} else if (boardArray[y][x + i] === undefined) {
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};

//check bottom right
var checkBottomRight = function (sym, x, y) {
	if (x > 8 - 3 || y > 8 - 3) {
		return false;
	} else {
		if (boardArray[y + 1][x + 1] !== null) {
			if (boardArray[y + 1][x + 1] !== sym) {
				var minCount = Math.min(8 - x, 8 - y);
				for (i = 2; i < minCount; i++) {
					if (boardArray[y + i][x + i] === sym) {
						return true;
					} else if (boardArray[y + i][x + i] === null) {
						return false;
					} else if (boardArray[y + i][x + i] === undefined) {
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};
//check bottom
var checkBottom = function (sym, x, y) {
	if (y > 8 - 3) {
		return false;
	} else {
		if (boardArray[y + 1][x] !== null) {
			if (boardArray[y + 1][x] !== sym) {
				var minCount = 8 - y;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y + i][x] === sym) {
						return true;
					} else if (boardArray[y + i][x] === null) {
						return false;
					} else if (boardArray[y + i][x] === undefined) {
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};

//check bottom left
var checkBottomLeft = function (sym, x, y) {
	if (y > 8 - 3 || x < 2) {
		return false;
	} else {
		if (boardArray[y + 1][x - 1] !== null) {
			if (boardArray[y + 1][x - 1] !== sym) {
				var minCount = Math.min(8 - y - 1, x) + 1;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y + i][x - i] === sym) {
						return true;
					} else if (boardArray[y + i][x - i] === null) {
						return false;
					} else if (boardArray[y + i][x - i] === undefined) {
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};

//check left
var checkLeft = function (sym, x, y) {
	if (x < 2) {
		return false;
	} else {
		if (boardArray[y][x - 1] !== null) {
			if (boardArray[y][x - 1] !== sym) {
				var minCount = x + 1;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y][x - i] === sym) {
						return true;
					} else if (boardArray[y][x - i] === null) {
						return false;
					} else if (boardArray[y][x - i] === undefined) {
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};

var removePredictionDots = function (sym) {
	for (var i = 0; i < predictions.length; i++) {
		var target = document.getElementById(predictions[i]);
		target.removeChild(target.firstChild);
	}
};

var changeRespectiveDisks = function (target, sym, x, y) {
	var topLeftSettle = false;
	var topSettle = false;
	var topRightSettle = false;
	var rightSettle = false;
	var bottomRightSettle = false;
	var bottomSettle = false;
	var bottomLeftSettle = false;
	var leftSettle = false;

	for (i = 0; i < 8; i++) {
		switch (i) {
			case 0:
				if (direction[i]) {
					while (!topLeftSettle) {
						if (boardArray[y - 1][x - 1] !== null) {
							var a = 1;
							while (boardArray[y - a][x - a] !== sym) {
								boardArray[y - a][x - a] = sym;
								if (sym === "W")
									document
										.getElementById(8 * (y - a) + (x - a))
										.firstChild.setAttribute("class", "white-tiles");
								else
									document
										.getElementById(8 * (y - a) + (x - a))
										.firstChild.setAttribute("class", "black-tiles");
								a++;
							}
							topLeftSettle = true;
						} else {
							topLeftSettle = true;
						}
					}
				}
				break;
			case 1:
				if (direction[i]) {
					while (!topSettle) {
						if (boardArray[y - 1][x] !== null) {
							var a = 1;
							while (boardArray[y - a][x] !== sym) {
								boardArray[y - a][x] = sym;
								if (sym === "W")
									document
										.getElementById(8 * (y - a) + x)
										.firstChild.setAttribute("class", "white-tiles");
								else
									document
										.getElementById(8 * (y - a) + x)
										.firstChild.setAttribute("class", "black-tiles");
								a++;
							}
							topSettle = true;
						} else {
							topSettle = true;
						}
					}
				}
				break;
			case 2:
				if (direction[i]) {
					while (!topRightSettle) {
						if (boardArray[y - 1][x + 1] !== null) {
							var a = 1;
							while (boardArray[y - a][x + a] !== sym) {
								boardArray[y - a][x + a] = sym;

								if (sym === "W")
									document
										.getElementById(8 * (y - a) + (x + a))
										.firstChild.setAttribute("class", "white-tiles");
								else
									document
										.getElementById(8 * (y - a) + (x + a))
										.firstChild.setAttribute("class", "black-tiles");
								a++;
							}

							topRightSettle = true;
						} else {
							topRightSettle = true;
						}
					}
				}
				break;
			case 3:
				if (direction[i]) {
					while (!rightSettle) {
						if (boardArray[y][x + 1] !== null) {
							var a = 1;
							while (boardArray[y][x + a] !== sym) {
								boardArray[y][x + a] = sym;
								if (sym === "W")
									document
										.getElementById(8 * y + (x + a))
										.firstChild.setAttribute("class", "white-tiles");
								else
									document
										.getElementById(8 * y + (x + a))
										.firstChild.setAttribute("class", "black-tiles");
								a++;
							}
							rightSettle = true;
						} else {
							rightSettle = true;
						}
					}
				}
				break;
			case 4:
				if (direction[i]) {
					while (!bottomRightSettle) {
						if (boardArray[y + 1][x + 1] !== null) {
							var a = 1;
							while (boardArray[y + a][x + a] !== sym) {
								boardArray[y + a][x + a] = sym;
								if (sym === "W")
									document
										.getElementById(8 * (y + a) + (x + a))
										.firstChild.setAttribute("class", "white-tiles");
								else
									document
										.getElementById(8 * (y + a) + (x + a))
										.firstChild.setAttribute("class", "black-tiles");
								a++;
							}
							bottomRightSettle = true;
						} else {
							bottomRightSettle = true;
						}
					}
				}
				break;
			case 5:
				if (direction[i]) {
					while (!bottomSettle) {
						if (boardArray[y + 1][x] !== null) {
							var a = 1;
							while (boardArray[y + a][x] !== sym) {
								boardArray[y + a][x] = sym;
								if (sym === "W")
									document
										.getElementById(8 * (y + a) + x)
										.firstChild.setAttribute("class", "white-tiles");
								else
									document
										.getElementById(8 * (y + a) + x)
										.firstChild.setAttribute("class", "black-tiles");
								a++;
							}
							bottomSettle = true;
						} else {
							bottomSettle = true;
						}
					}
				}
				break;
			case 6:
				if (direction[i]) {
					while (!bottomLeftSettle) {
						if (boardArray[y + 1][x - 1] !== null) {
							var a = 1;
							while (boardArray[y + a][x - a] !== sym) {
								boardArray[y + a][x - a] = sym;
								if (sym === "W")
									document
										.getElementById(8 * (y + a) + (x - a))
										.firstChild.setAttribute("class", "white-tiles");
								else
									document
										.getElementById(8 * (y + a) + (x - a))
										.firstChild.setAttribute("class", "black-tiles");
								a++;
							}
							bottomLeftSettle = true;
						} else {
							bottomLeftSettle = true;
						}
					}
				}
				break;
			case 7:
				if (direction[i]) {
					while (!leftSettle) {
						if (boardArray[y][x - 1] !== null) {
							var a = 1;
							while (boardArray[y][x - a] !== sym) {
								boardArray[y][x - a] = sym;
								if (sym === "W")
									document
										.getElementById(8 * y + (x - a))
										.firstChild.setAttribute("class", "white-tiles");
								else
									document
										.getElementById(8 * y + (x - a))
										.firstChild.setAttribute("class", "black-tiles");
								a++;
							}
							leftSettle = true;
						} else {
							leftSettle = true;
						}
					}
				}
				break;
		}
	}
};

var checkSlots = function (sym) {
	let emptySlots = 0;
	let roughtCount = 0;
	for (var y = 0; y < 8; y++) {
		for (var x = 0; x < 8; x++) {
			if (boardArray[y][x] === null) {
				emptySlots++;
				if (checkOKtoPlace(sym, x, y)) {
					roughtCount++;
				}
			}
		}
	}

	return { empty: emptySlots, movable: roughtCount };
};

var predictionDots = function (sym) {
	predictions = [];
	for (var y = 0; y < 8; y++) {
		for (var x = 0; x < 8; x++) {
			if (boardArray[y][x] === null) {
				if (checkOKtoPlace(sym, x, y)) {
					var createPredictor = document.createElement("div");
					createPredictor.setAttribute("class", "predictor");
					createPredictor.setAttribute("horizontal", x);
					createPredictor.setAttribute("vertical", y);
					createPredictor.setAttribute("onclick", "runDisk(this)");
					var id = y * 8 + x;
					document.getElementById(id).appendChild(createPredictor);
					predictions.push(id);
				}
			}
		}
	}
};

var tempStopAllClicks = function () {
	for (var y = 0; y < 8; y++) {
		for (var x = 0; x < 8; x++) {
			if (boardArray[y][x] === null) {
				document
					.getElementById(y * 8 + x)
					.removeEventListener("click", addDisk);
			}
		}
	}
};

var checkWin = function () {
	var getWinDisplay = document.querySelector(".win-lose-draw");
	let actualBlackScore = parseInt(blackScore.innerHTML);
  let actualWhiteScore = parseInt(whiteScore.innerHTML);

		let winner;
		if (actualBlackScore > actualWhiteScore) {
				winner = "B";
			ws.send(
				JSON.stringify({
					type: Messages.GAME_WON_BY,
					data: "BLACK"
				})
			);
		} else if (actualBlackScore < actualWhiteScore) {
      winner = "W";
			ws.send(
				JSON.stringify({
          			type: Messages.GAME_WON_BY,
				    data: "WHITE" 
				})
			);
		} else if (actualBlackScore === actualWhiteScore) {
			getWinDisplay.innerHTML = "It is a Draw!!";
		}
	};

var removeMainPageContainer = function () {
	var mainContainer = document.querySelector("#center");
	while (mainContainer.firstChild) {
		mainContainer.removeChild(mainContainer.firstChild);
	}
};

var runDisk = function (something) {
	console.log(something.parentNode);
	addDisk(something.parentNode);
};

openWebSocketConnection();
removeMainPageContainer();
InitializeBoard();
var getSym = counter % 2 === 0 ? "W" : "B";
predictionDots(getSym);

