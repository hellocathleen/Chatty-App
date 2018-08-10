import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import randomColor from 'randomcolor';

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = new WebSocket("ws://localhost:3001/");
    this.state = {
      userColor: randomColor({luminosity: 'dark' || 'bright'}),
      userCount: '',
      currentUser: {name: "Anonymous"},
      messages: []
    }
    this.updateUser = this.updateUser.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }
  componentDidMount() {
    console.log("componentDidMount <App />");

    const ws = this.socket;
    ws.onopen = function (event) {
      console.log("Connected to server!")
    };
    let messageArray = [];
    //when message is received, turn received message into object, push new message object to array, add this message to the state
      ws.onmessage = function (event) {
        let newMessage = JSON.parse(event.data);
        console.log("newMessage", newMessage)
        switch(newMessage.type) {
          case "incomingMessage":
            //handle incoming message
            messageArray.push(newMessage)
            this.setState({messages: this.state.messages.concat(messageArray)})
            messageArray = [];
            break;
          case "incomingNotification":
            //handle incoming notification
            console.log(newMessage)
            messageArray.push(newMessage)
            this.setState({messages: this.state.messages.concat(messageArray)})
            messageArray = [];
            break;
          case "userCountChanged":
            //handle user count change
            console.log("usercount case", newMessage.userCount)
            this.setState({userCount: newMessage.userCount})
            break;
          default:
          //show an error in the console if the message type is unknown
            throw new Error("Unknown event type " + newMessage.type);
        }
        console.log("STATE:", this.state)
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

  addMessage(event){
    if (event.keyCode === 13) {
      console.log('Enter was pressed');
      console.log(this.state.currentUser.color);
      var msg = {
        type: "postMessage",
        username: this.state.currentUser.name,
        content: event.target.value,
        color: this.state.userColor
      }
      this.socket.send(JSON.stringify(msg))
      event.target.value = "";
    }
  }

  numUsers(num) {
    if (num == false) {
      return "0 users online";
    } else if (num === 1) {
      return this.state.userCount + " user online";
    } else {
      return this.state.userCount + " users online";
    }
  }

  render() {
    return (
      <div> 
      <nav className="navbar">
        <a href="/" className="navbar-brand">ChitChat</a>
        <span className="navbar-count">{this.numUsers(this.state.userCount)}</span>
      </nav>
      <div> 
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser.name} updateUser={this.updateUser} addMessage={this.addMessage} />
      </div>
      </div>
    );
  }
}
export default App;
