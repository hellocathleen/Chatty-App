import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = new WebSocket("ws://localhost:3001/");
    this.state = {
      currentUser: {name: "Anonymous"},
      messages: [],
      //notifications: []
    }
    this.updateUser = this.updateUser.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentDidMount() {
    console.log("componentDidMount <App />");

    const ws = this.socket;
    ws.onopen = function (event) {
      console.log("Connected to server!")
    };
    let messageArray = [];
    // const notificationArray = [];
    //when message is received, turn received message into object, push new message object to array, add this message to the state
      ws.onmessage = function (event) {
        let newMessage = JSON.parse(event.data);
        console.log(newMessage)
        switch(newMessage.type) {
          case "incomingMessage":
            //handle incoming message
            messageArray.push(newMessage)
            this.setState({messages: this.state.messages.concat(messageArray)})
            console.log("STATE", this.state.messages)
            messageArray = [];
            break;
          case "incomingNotification":
            //handle incoming notification
            console.log(newMessage)
            messageArray.push(newMessage)
            this.setState({messages: this.state.messages.concat(messageArray)})
            console.log("STATE", this.state.messages)
            messageArray = [];
              break;
          default:
          //show an error in the console if the message type is unknown
            throw new Error("Unknown event type " + newMessage.type);
        }
      }.bind(this)
  };
    

  updateUser(event){
    if (this.state.currentUser.name !== event.target.value && event.target.value) {
    console.log("current user updated to:", event.target.value)
    var note = {
      type: "postNotification",
      notification: `${this.state.currentUser.name} has changed their name to ${event.target.value}`,
      }
    this.socket.send(JSON.stringify(note))
    this.setState({currentUser: {name: event.target.value}})
    }
  }

  handleKeyPress(event){
    if (event.keyCode === 13) {
      console.log('Enter was pressed');
      var msg = {
        type: "postMessage",
        username: this.state.currentUser.name,
        content: event.target.value,
      }
      this.socket.send(JSON.stringify(msg))
      event.target.value = "";
    }
  }

  render() {
    return (
      <div> 
        <MessageList messages={this.state.messages}/>
        <ChatBar currentUser={this.state.currentUser.name} updateUser={this.updateUser} handleKeyPress={this.handleKeyPress} />
      </div>
    );
  }
}
export default App;
