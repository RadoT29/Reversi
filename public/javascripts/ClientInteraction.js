var ws;
const handlePlayedMove = data => {
	addDisk(null, data);
};

const openWebSocketConnection = () => {
	console.log("openWebSocketConnection");
    ws = new WebSocket(Setup.WEB_SOCKET_URL);

	ws.onopen = () => {
		console.log("ws is now open");
	};

	ws.onmessage = function(message) {
		let currentMessage = JSON.parse(message.data);

		if (currentMessage.type == Messages.HAS_MADE_A_MOVE){
			handlePlayedMove(currentMessage);
		} else if (currentMessage.data == "WHITE"){
			colorOfPlayer = "W";

			document.querySelector('#opp').style.setProperty("--contentTurn2", "' can make a move!'");
			document.getElementById("I").setAttribute("class", "white");
			document.getElementById("opp").setAttribute("class", "black");
			console.log(colorOfPlayer);
			document.querySelector("#win-lose-draw").innerHTML = "Currently waiting for another player!";
		} else if (currentMessage.data == "BLACK"){
			colorOfPlayer = "B";

			document.querySelector('#I').style.setProperty("--contentTurn", "' can make a move!'");
			document.getElementById("I").setAttribute("class", "black");
			document.getElementById("opp").setAttribute("class", "white");
			console.log(colorOfPlayer);
			document.querySelector("#win-lose-draw").innerHTML = "";
			ws.send(Messages.TWO_PLAYERS_STRING);
		} else if(currentMessage.type == Messages.TWO_PLAYERS_TEXT){
			document.querySelector("#win-lose-draw").innerHTML = "";
		} else if (currentMessage.type == Messages.GAME_OVER){

			if(currentMessage.data == "DRAW"){
				getWinDisplay.innerHTML = "It is a Draw!!";
			} else{
				getWinDisplay.innerHTML = "The winner is "+ currentMessage.data;
			}

		} else{
			return;
		}
	};

	ws.onclose = () => {
		ws.send(
			JSON.stringify({
				data: "socketClosed"
			})
		);
	};
};