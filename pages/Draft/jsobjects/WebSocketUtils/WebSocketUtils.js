export default {
  socketResponse: null,
	
	user_max_bid: 185,
  // This variable holds the WebSocket endpoint URL
  WEBSOCKET_ENDPOINT: "ws://web:8001",
  // This property will hold the WebSocket object once it is instantiated
  socket: undefined,
  // This function will be executed when the WebSocket connection is successfully established
  socketOnOpen: function(data) { // Changed to a function expression
    console.log('onopen', data);
    // You might want to call sendEvent here to subscribe or send an initial message
  },
	
	
  // This function will be executed when a message is received through the WebSocket connection
  socketOnMessage: function(message) { // Changed to a function expression
    let response = JSON.parse(message?.data);
    if (response.event === 'auction_update') {
      // Assuming you have state variables for currentBid and highestBidder
      let currentBid = response.current_bid;
      let highestBidder = response.highest_bidder;
			
			 // Update the text widget with the current bid
    CurrentBid_Text.setText("Current Bid: $" + currentBid.toString());
    
    // If you have a widget to display the highest bidder, update it as well
    HighestBidder_Text.setText("Highest Bidder: " + highestBidder);
    } else if (response.event === 'new_round') {
        // Handle the start of a new round
        let newPlayer = response.player;
				let nominater = response.nominater;
        this.user_max_bid = response.user_max;
				storeValue('nominator', response.nominator);

        // Reset the UI for the new round
        CurrentBid_Text.setText("Current Bid: $0");
        HighestBidder_Text.setText("Highest Bidder: " + nominater);
        NewPlayer_Text.setText("Player on Auction: " + newPlayer); 
    } else if (response.event === 'prompt_nomination') {
        // Logic to show the modal or dropdown for player selection
        showAlert('Nominate a Player', 'info');
				// On Page 2
				let isNominationEnabled = appsmith.store.isNominationEnabled;

		}
    console.log("socketOnMessage", response);
    this.socketResponse = response; // Removed the ?.data since you're already inside the response
  },
  // This function will be executed when the WebSocket connection is closed
  socketOnClose: function(data) { // Changed to a function expression
    console.log('onclose', data);
	},
		
		
  // This asynchronous function is intended to be called when the page loads.
  // It initializes the WebSocket connection using the provided WEBSOCKET_ENDPOINT
  // and sets up the event handlers for its onopen, onclose, and onmessage
  onPageLoad: async function() { // Changed to a function expression
    this.socket = new WebSocket(this.WEBSOCKET_ENDPOINT);
    this.socket.onopen = this.socketOnOpen.bind(this); // Binding this to the function
    this.socket.onclose = this.socketOnClose.bind(this); // Binding this to the function
    this.socket.onmessage = this.socketOnMessage.bind(this); // Binding this to the function
  },
	
	sendUserBid: function() {
    // Retrieve the bid amount from the UserBidInput widget
    let bidAmount = Input1.text

    // Retrieve the current bid from the CurrentBid_Text widget
    let currentBid = parseInt(CurrentBid_Text.text.replace('$', ''));

    // Retrieve the user's max bid (assuming it's been stored in the UserMaxBid variable)
    let userMaxBid = this.user_max_bid;

    // Validate the bid amount
    if (isNaN(bidAmount)) {
        showAlert('Please enter a valid bid amount.', 'error');
        return;
    }
    if (bidAmount <= currentBid) {
        showAlert('Your bid must be higher than the current bid.', 'error');
        return;
    }
    if (bidAmount > userMaxBid) {
        showAlert(`Your bid cannot be higher than your max bid of $${userMaxBid}.`, 'error');
        return;
    }

    // If validation passes, send the bid event to the server
    this.sendEvent("place_human_bid", { amount: bidAmount });

    // Optional: Provide feedback to the user or clear the input field
    // ...
	},
	
		sendNomination: function(selectedPlayer) {
   	 this.sendEvent("player_nominated", { player: selectedPlayer });
   	 storeValue('isNominationEnabled', false); // Disable nomination after selection
	},

	
	// Function to send events through the WebSocket connection
    sendEvent: function(eventType, data) {
        let eventObj = {
            event: eventType,
            data: data,
            timestamp: Date.now()
        };
        this.socket.send(JSON.stringify(eventObj));
    }

  
};
