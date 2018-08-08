import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      messages:  [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
          id: "msg1"
        },
        {
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good.",
          id: "msg2"
        }
      ]
    }
    this.updateUser = this.updateUser.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    //this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    console.log("componentDidMount <App />");
    setTimeout(() => {
      console.log("Simulating incoming message");
      //Add a new message to the list of messages in the data store
      const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage)
      this.setState({messages: messages});
    }, 3000)
  }

  updateUser(event){
    this.setState({currentUser: {name: event.target.value}})
    console.log("current user updated to:", event.target.value)
  }

  handleKeyPress(event){
    if (event.keyCode === 13) {
      console.log('Enter was pressed');

      const newMessage = {
        username: this.state.currentUser.name,
        content: event.target.value,
        id: new Date().toString()
      }
      const newMessages = this.state.messages.concat(newMessage)
      this.setState({messages: newMessages});
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
