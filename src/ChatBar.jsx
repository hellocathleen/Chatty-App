import React, {Component} from 'react';

class ChatBar extends Component {

  render() {
    return (
      <footer className="chatbar">
          <input className="chatbar-username" name="username" onBlur={this.props.updateUser} defaultValue={this.props.currentUser} placeholder="Your Name (Optional)" />
          <input className="chatbar-message" name="messageContent" onKeyDown={this.props.handleKeyPress} placeholder="Type a message and hit ENTER" />
      </footer>
    );
  }
}

export default ChatBar;
