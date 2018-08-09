import React, {Component} from 'react';
import Message from './Message.jsx';
import Notification from './Notification.jsx';

class MessageList extends Component {

  render() {
    return (
      <main className="messages">
        {this.props.messages.map((messageObj) => {
          if(messageObj.type === 'incomingNotification'){
            return <Notification key={messageObj.notificationId} notification={messageObj.notification}/>
          }
          return <Message key={messageObj.id} username={messageObj.username} content={messageObj.content} />
          })}
      </main>
    )
  }
}

export default MessageList;

