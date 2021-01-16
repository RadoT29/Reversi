var boardArray = [];
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
			if (squareColorCounter % 2 === 1) {
				square.style.backgroundColor = "#86B50F";
			}
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
              disk.setAttribute("class", "whiteDisk");
        boardArray[yValue][xValue] = "W";
        
          } else {
              disk.setAttribute("class", "blackDisk");
        boardArray[yValue][xValue] = "B";
            }
          file.appendChild(disk);
         // file.removeEventListener("click", addDisk);
  
          colour++;
    }
  
    for(var i=end; i>34; i--){
      var file = document.getElementById(i);
      var xValue = parseInt(file.getAttribute("horizontal"));
          var yValue = parseInt(file.getAttribute("vertical"));
      var disk = document.createElement("div");
      if (colour % 2 === 0) {
              disk.setAttribute("class", "whiteDisk");
              boardArray[yValue][xValue] = "W";
          } else {
              disk.setAttribute("class", "blackDisk");
              boardArray[yValue][xValue] = "B";
          }
          file.appendChild(disk);
        //  file.removeEventListener("click", addDisk);
  
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
            //  files[id].addEventListener("click", addDisk);
              id++;
             }
          }   
    newBoardArray();
    placeStartingDisks();
  }

var tilesCounting = function () {
	var whiteCount = 0;
	var blackCount = 0;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (_boardArray[i][j] === "W") {
                whiteCount += 1;
            }else if (_boardArray[i][j] === "B"){
                blackCount += 1;
            }
		}
	}
	blackScore.innerHTML = blackCount;
	whiteScore.innerHTML = whiteCount;
};

openWebSocketConnection();
InitializeBoard();

