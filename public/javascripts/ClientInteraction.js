const openWebSocketConnection = () => {
	console.log("openWebSocketConnection");
	var ws = new WebSocket(Setup.WEB_SOCKET_URL);

	ws.onopen = () => {
        console.log("ws is now open");
	};

	/*ws.onmessage = data => {
		let parsedData = JSON.parse(data.data);

		if (parsedData.messageName === "greeting") {
			console.log(parsedData.message);
		} else if (parsedData.name === "playedMove") {
			handlePlayedMove(parsedData);
		} else if (parsedData.name === "allSockets") {
			setOpponentUsername(parsedData.message);
		}
	};
*/
	ws.onclose = () => {
		ws.send(
			JSON.stringify({
				messageName: "socketClosed"
			})
		);
	};
};