import React, { Component } from 'react';
import * as $ from 'jquery';
import * as strftime from 'strftime';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
var UNICODE_REGEX = /[^\u0000-\u007F]+/;
var URL_REGEX = /https?:\/\/?[\da-z\.-]+\.[a-z\.]{2,6}[\/\w \.-]*\/?/;

class Messages extends Component {

  render() {

    var messageList = this.props.messages.map(function(message, i){
      var text = message.text;

      var emojiMatches = text.match(UNICODE_REGEX);

      if (emojiMatches) {
        $.each(emojiMatches, function(index, match){
          text = text.replace(UNICODE_REGEX, "<span class='emoji'>"+match+"</span>");
        });
      }

      var urlMatches = text.match(URL_REGEX);
      if (urlMatches) {
        $.each(urlMatches, function(index, match){
          text = text.replace(URL_REGEX, "<a class='heavy' target='_blank' href='"+match+"'>"+match+"</a>");
        });
      }


      return  (
        <div className="message" key={i}>
          <div className="avatar">
            <img src={"https://twitter.com/"+message.name+"/profile_image?size=original"} />
          </div>
          <div className="text-display">
            <div className="message-data">
              <span className="author">{message.name}</span>
              <span className="timestamp">{strftime('%H:%M:%S %P', new Date(message.time))}</span>
              <span className="seen"></span>
            </div>
            <p className="message-body" dangerouslySetInnerHTML={{__html: text}}>
            </p>
          </div>
        </div>

      )

    });

    return (
      <div id="message-list">
        <div className="time-divide">
          <span className="date">
            Today
          </span>
        </div>
      {messageList}
      </div>
    );
  }

}
export default graphql(gql`
query {
  messages {
    name
    text
    time
  }
}
`)(Messages);