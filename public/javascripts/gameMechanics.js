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
    var container = document.querySelector("#main-game");
    var boardContainer = document.createElement("div");
	boardContainer.setAttribute("class", "main-board");
	var boardFrame = document.createElement("div");
	boardFrame.setAttribute("class", "board-frame");

	for (var i = 0; i < 8; i++) {
		var row = document.createElement("div");
		if(i==7){
			row.setAttribute("class", "rowLast")
		}else{
		row.setAttribute("class", "row");
		}
		for (var j = 0; j < 8; j++) {
			var square = document.createElement("div");
			square.setAttribute("class", "col");
			row.appendChild(square);
		}
		boardContainer.appendChild(row);
	}
	boardFrame.appendChild(boardContainer);
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
              disk.setAttribute("class", "white-disks");
        boardArray[yValue][xValue] = "W";
        
          } else {
              disk.setAttribute("class", "black-disks");
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
              disk.setAttribute("class", "white-disks");
              boardArray[yValue][xValue] = "W";
          } else {
              disk.setAttribute("class", "black-disks");
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
	const files = document.querySelectorAll(".col");

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
	let xValue, yValue, colourOfTurn, target;

  if(!socketData) {
		event instanceof Element ? (target = event) : (target = event.target);

		xValue = parseInt(target.getAttribute("horizontal"));
		yValue = parseInt(target.getAttribute("vertical"));
		colourOfTurn = counter % 2 === 0 ? "W" : "B";
  }else{
		xValue = socketData.message.x;
		yValue = socketData.message.y;
		colourOfTurn = socketData.message.color;
		target = getFiles(xValue, yValue);
  }
  
  if (!socketData) {
		if (colorOfPlayer !== colourOfTurn) {
			console.log("It is not your turn");
			return;
	}
	}

  console.log( colourOfTurn+" player made a move: horizontal:"+xValue+", vertical: "+yValue,);
  
	if (checkOKtoPlace(colourOfTurn, xValue, yValue)) {
		removePredictionDots();

		var disk = document.createElement("div");
		target.classList.add("test");

		if (colourOfTurn === "W") {
			disk.setAttribute("class", "white-disks");
			boardArray[yValue][xValue] = colourOfTurn;
		} else {
			disk.setAttribute("class", "black-disks");
			boardArray[yValue][xValue] = colourOfTurn;
		}
		changeRespectiveDisks(target, colourOfTurn, xValue, yValue);

		counter++;

		target.appendChild(disk);
		target.removeEventListener("click", addDisk);

		if(!socketData){
			ws.send(
				JSON.stringify({
					type: Messages.HAS_MADE_A_MOVE,
					data: "playedMove",
					message: { color: colourOfTurn, x: xValue, y: yValue }
				})
			);
		}
		diskCounting();
		colourOfTurn = counter % 2 === 0 ? "W" : "B";

		console.log(colourOfTurn + "'s turn");
		var slots = checkSlots(colourOfTurn);

		if (slots.empty > 0) {
			if (slots.movable > 0) {
				console.log(colourOfTurn + " still can place a disk");
        		predictionDots(colourOfTurn);
			} else {
				console.log(colourOfTurn + " has no place to place a disk, pass");
				counter++;
				colourOfTurn = counter % 2 === 0 ? "W" : "B";
				console.log(colourOfTurn + "'s turn");
				var slots = checkSlots(colourOfTurn);
				if (slots.movable > 0) {
					predictionDots(colourOfTurn);
				} else {
					console.log(colourOfTurn + " also cannot place a disk, end game ");
					tempStopAllClicks();
					checkWin();
				}
			}
		} else {
			console.log(colourOfTurn + " cannot place a move");
			tempStopAllClicks();
			checkWin();
		}
	} else {
		console.log("Invalid Move");
		return;
	}
};

var checkOKtoPlace = function (color, x, y) {
	var arr = [
		checkTopLeft(color, x, y),
		checkTop(color, x, y),
		checkTopRight(color, x, y),
		checkRight(color, x, y),
		checkBottomRight(color, x, y),
		checkBottom(color, x, y),
		checkBottomLeft(color, x, y),
		checkLeft(color, x, y)
	];

	direction = arr;

	if (arr.includes(true)) {
		return true;
	} else {
		return false;
	}
};

//check top left
var checkTopLeft = function (color, x, y) {
	if (x < 2 || y < 2) {
		return false;
	} else {
		if (boardArray[y - 1][x - 1] !== null) {
			if (boardArray[y - 1][x - 1] !== color) {
				var minCount = Math.min(x, y) + 1;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y - i][x - i] === color) {
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
var checkTop = function (color, x, y) {
	if (y < 2) {
		return false;
	} else {
		if (boardArray[y - 1][x] !== null) {
			if (boardArray[y - 1][x] !== color) {
				var minCount = y + 1;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y - i][x] === color) {
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
var checkTopRight = function (color, x, y) {
	if (y < 2 || x > 8 - 3) {
		return false;
	} else {
		if (boardArray[y - 1][x + 1] !== null) {
			if (boardArray[y - 1][x + 1] !== color) {
				var minCount = Math.min(8 - x - 1, y) + 1;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y - i][x + i] === color) {
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
var checkRight = function (color, x, y) {
	if (x > 8 - 3) {
		return false;
	} else {
		if (boardArray[y][x + 1] !== null) {
			if (boardArray[y][x + 1] !== color) {
				var minCount = 8 - x;
				for (i = 2; i < 8; i++) {
					if (boardArray[y][x + i] === color) {
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
var checkBottomRight = function (color, x, y) {
	if (x > 8 - 3 || y > 8 - 3) {
		return false;
	} else {
		if (boardArray[y + 1][x + 1] !== null) {
			if (boardArray[y + 1][x + 1] !== color) {
				var minCount = Math.min(8 - x, 8 - y);
				for (i = 2; i < minCount; i++) {
					if (boardArray[y + i][x + i] === color) {
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
var checkBottom = function (color, x, y) {
	if (y > 8 - 3) {
		return false;
	} else {
		if (boardArray[y + 1][x] !== null) {
			if (boardArray[y + 1][x] !== color) {
				var minCount = 8 - y;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y + i][x] === color) {
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
var checkBottomLeft = function (color, x, y) {
	if (y > 8 - 3 || x < 2) {
		return false;
	} else {
		if (boardArray[y + 1][x - 1] !== null) {
			if (boardArray[y + 1][x - 1] !== color) {
				var minCount = Math.min(8 - y - 1, x) + 1;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y + i][x - i] === color) {
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
var checkLeft = function (color, x, y) {
	if (x < 2) {
		return false;
	} else {
		if (boardArray[y][x - 1] !== null) {
			if (boardArray[y][x - 1] !== color) {
				var minCount = x + 1;
				for (i = 2; i < minCount; i++) {
					if (boardArray[y][x - i] === color) {
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

var removePredictionDots = function (color) {
	for (var i = 0; i < predictions.length; i++) {
		var target = document.getElementById(predictions[i]);
		target.removeChild(target.firstChild);
	}
};

var changeRespectiveDisks = function (target, color, x, y) {
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
							while (boardArray[y - a][x - a] !== color) {
								boardArray[y - a][x - a] = color;
								if (color === "W")
									document
										.getElementById(8 * (y - a) + (x - a))
										.firstChild.setAttribute("class", "white-disks");
								else
									document
										.getElementById(8 * (y - a) + (x - a))
										.firstChild.setAttribute("class", "black-disks");
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
							while (boardArray[y - a][x] !== color) {
								boardArray[y - a][x] = color;
								if (color === "W")
									document
										.getElementById(8 * (y - a) + x)
										.firstChild.setAttribute("class", "white-disks");
								else
									document
										.getElementById(8 * (y - a) + x)
										.firstChild.setAttribute("class", "black-disks");
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
							while (boardArray[y - a][x + a] !== color) {
								boardArray[y - a][x + a] = color;

								if (color === "W")
									document
										.getElementById(8 * (y - a) + (x + a))
										.firstChild.setAttribute("class", "white-disks");
								else
									document
										.getElementById(8 * (y - a) + (x + a))
										.firstChild.setAttribute("class", "black-disks");
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
							while (boardArray[y][x + a] !== color) {
								boardArray[y][x + a] = color;
								if (color === "W")
									document
										.getElementById(8 * y + (x + a))
										.firstChild.setAttribute("class", "white-disks");
								else
									document
										.getElementById(8 * y + (x + a))
										.firstChild.setAttribute("class", "black-disks");
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
							while (boardArray[y + a][x + a] !== color) {
								boardArray[y + a][x + a] = color;
								if (color === "W")
									document
										.getElementById(8 * (y + a) + (x + a))
										.firstChild.setAttribute("class", "white-disks");
								else
									document
										.getElementById(8 * (y + a) + (x + a))
										.firstChild.setAttribute("class", "black-disks");
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
							while (boardArray[y + a][x] !== color) {
								boardArray[y + a][x] = color;
								if (color === "W")
									document
										.getElementById(8 * (y + a) + x)
										.firstChild.setAttribute("class", "white-disks");
								else
									document
										.getElementById(8 * (y + a) + x)
										.firstChild.setAttribute("class", "black-disks");
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
							while (boardArray[y + a][x - a] !== color) {
								boardArray[y + a][x - a] = color;
								if (color === "W")
									document
										.getElementById(8 * (y + a) + (x - a))
										.firstChild.setAttribute("class", "white-disks");
								else
									document
										.getElementById(8 * (y + a) + (x - a))
										.firstChild.setAttribute("class", "black-disks");
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
							while (boardArray[y][x - a] !== color) {
								boardArray[y][x - a] = color;
								if (color === "W")
									document
										.getElementById(8 * y + (x - a))
										.firstChild.setAttribute("class", "white-disks");
								else
									document
										.getElementById(8 * y + (x - a))
										.firstChild.setAttribute("class", "black-disks");
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

var checkSlots = function (color) {
	let emptySlots = 0;
	let roughCount = 0;
	for (var y = 0; y < 8; y++) {
		for (var x = 0; x < 8; x++) {
			if (boardArray[y][x] === null) {
				emptySlots++;
				if (checkOKtoPlace(color, x, y)) {
					roughCount++;
				}
			}
		}
	}

	return { empty: emptySlots, movable: roughCount };
};

var predictionDots = function (color) {
	predictions = [];
	for (var y = 0; y < 8; y++) {
		for (var x = 0; x < 8; x++) {
			if (boardArray[y][x] === null) {
				if (checkOKtoPlace(color, x, y)) {
					var createPrediction = document.createElement("div");
					createPrediction.setAttribute("class", "prediction");
					createPrediction.setAttribute("horizontal", x);
					createPrediction.setAttribute("vertical", y);
					createPrediction.setAttribute("onclick", "runDisk(this)");
					var id = y * 8 + x;
					document.getElementById(id).appendChild(createPrediction);
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
	var getWinDisplay = document.querySelector("#win-lose-draw");
	let actualBlackScore = parseInt(blackScore.innerHTML);
  let actualWhiteScore = parseInt(whiteScore.innerHTML);

		let winner;
		if (actualBlackScore > actualWhiteScore) {
			winner = "B";
			getWinDisplay.innerHTML = "The Winner is Black";
			ws.send(
				JSON.stringify({
					type: Messages.GAME_WON_BY,
					data: "BLACK"
				})
			);
		} else if (actualBlackScore < actualWhiteScore) {
	 		 winner = "W";
			getWinDisplay.innerHTML = "The Winner is White";
			ws.send(
				JSON.stringify({
          			type: Messages.GAME_WON_BY,
				    data: "WHITE" 
				})
			);
		} else if (actualBlackScore === actualWhiteScore) {
			getWinDisplay.innerHTML = "It is a Draw!!";
			ws.send(JSON.stringify({
				type: Messages.GAME_WON_BY,
			    data: "DRAW" 
		  }));
		}
	};

var removeMainPageContainer = function () {
	var mainContainer = document.querySelector("#main-game");
	while (mainContainer.firstChild) {
		mainContainer.removeChild(mainContainer.firstChild);
	}
};

var runDisk = function (position) {
	addDisk(position.parentNode);
};

openWebSocketConnection();
removeMainPageContainer();
InitializeBoard();
var colourOfTurn = counter % 2 === 0 ? "W" : "B";
predictionDots(colourOfTurn);

