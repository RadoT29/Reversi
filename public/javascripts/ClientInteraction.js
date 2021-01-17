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
			console.log(colorOfPlayer);
		} else if (currentMessage.data == "BLACK"){
			colorOfPlayer = "B";
			console.log(colorOfPlayer);
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