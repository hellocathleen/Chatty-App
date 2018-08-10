import React, {Component} from 'react';

class Message extends Component {
  
  render() {
    const fontColor = {
      color: this.props.color
    };
    let image;
    let messageContent;
    //check if there is a .jpg/png/gif 
    if (/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(this.props.content)) {
      const urlRegex = /(https?:\/\/[^ ]*)/;
      image = this.props.content.match(urlRegex)[0];
      messageContent = this.props.content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    } else {
      messageContent = this.props.content;
    }

    return (
        <div className="message">
          <span className="message-username" style={fontColor}>{this.props.username}</span>
          <span className="message-content">
          {messageContent}
          <br />
          <img className="msgImage" src={image} />
          </span>
        </div>
    );
  }
}

export default Message;

