import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {

  render() {
    const messageListItem = this.props.messages.map((messageObj) => {
      return <Message key={messageObj.id} username={messageObj.username} content={messageObj.content} />
    });

    return(
      <div>
        {messageListItem}
      </div>
    );
  }
}

export default MessageList;