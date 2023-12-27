export default {
	socketResponse: null,
	/*  This variable holds the WebSocket endpoint URL  */
	WEBSOCKET_ENDPOINT: "ws://localhost:4000",
	/* This property will hold the WebSocket object once it is instantiated */
	socket: undefined,
	/* This function will be executed when the WebSocket connection is successfully established */
	socketOnOpen: (data) => {
		console.log('onopen', data);
	},
	/* This function will be executed when a message is received through the WebSocket connection */
	socketOnMessage: (message) => {
		let response = JSON.parse(message?.data);
		console.log("socketOnMessage", response);
		this.socketResponse = response?.data;
	},
	/* This function will be executed when the WebSocket connection is closed */
	socketOnClose: (data) => {
		console.log('onclose', data);
	},
	/*
		This asynchronous function is intended to be called when the page loads.
		It initializes the WebSocket connection using the provided WEBSOCKET_ENDPOINT
		and sets up the event handlers for its onopen, onclose and onmessage
	*/
	onPageLoad: async() => {
		this.socket = new WebSocket(this.WEBSOCKET_ENDPOINT);
		this.socket.onopen = this.socketOnOpen;
		this.socket.onclose = this.socketOnClose;	
		this.socket.onmessage = this.socketOnMessage;
	}