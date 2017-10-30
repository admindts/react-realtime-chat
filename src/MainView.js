import React, { Component } from 'react';

// const client = new ApolloClient();
import Messages from './Messages';
import Pusher from 'pusher-js';
import * as $ from 'jquery';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ButtonSend from './Button';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  toIdValue,
} from 'react-apollo';

import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:4000/graphql',
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      setTimeout(next, 500);
    },
  },
]);

const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
  reconnect: true,
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

function dataIdFromObject(result) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  customResolvers: {
    Query: {
      messages: (_, args) => {
        console.log('here');
        return toIdValue(
          dataIdFromObject({ __typename: 'Message', id: args['id'] })
        );
      },
    },
  },
  dataIdFromObject,
});


// const client = new ApolloClient();
// const messageListQuery = gql`
// query messageListQuery {
//   messages {
//     name
//     text
//     time
//   }
// }
// `;
// const MessageListWithData = graphql(messageListQuery)(Messages);
class MainView extends Component {

  constructor(props) {
    super(props);
    var messages = ['Hi there! 😘', 'Welcome to your chat app', 'See the tutorial at http://blog.pusher.com/react-chat'];
    messages = messages.map(function(msg){
      return {
        name: 'pusher',
        time: new Date(),
        text: msg
      }
    });
    this.state = {
      messages: messages,
      inputValue: ''
    }

    this._onClick = this._onClick.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
  }

  componentWillMount() {

    this.pusher = new Pusher('d02baf1ebb9018ac54ef', {
      cluster: 'ap2'
    });
    this.chatRoom = this.pusher.subscribe('messages');

  }

  componentDidMount() {

    this.chatRoom.bind('new_message', function(message){
      this.setState({messages: this.state.messages.concat(message)})

      $("#message-list").scrollTop($("#message-list")[0].scrollHeight);

    }, this);

    $(document).ready(function(){
      // $('#msg-input').emojiPicker({
      //   height: '150px',
      //   width: '200px',
      //   button: false
      // }); 

    });



  }

  updateInputValue(evt) {
    this.setState({
      messages: this.state.messages,
      inputValue: evt.target.value
    });
  }

  sendMessage(text){
    var message = {
      name: this.props.name,
      text: text,
      time: new Date()
    }

    $.ajax({
      url: 'http://localhost:4000/messages',
      type: 'POST',
      data: message,
      success: function(){
        var input = document.getElementById('msg-input');
        input.value = ""
      }
    });

    this.setState({
      messages: this.state.messages,
      inputValue: ''
    });
  }

  _onClick(e){
    var input = document.getElementById('msg-input');
    var text = input.value;
    if (text === "") return;
    this.sendMessage(text);
  }

  _onEnter(e){
    if (e.nativeEvent.keyCode != 13) return;
    e.preventDefault();
    var input = e.target;
    var text = input.value;

    if (text === "") return;
    this.sendMessage(text);
  }

  toggleEmoji(evt){
      $('#msg-input').emojiPicker('toggle');
  }

  render() {

    if (!this.props.name) var style = {display:'none'}


    var body = (
      <div className="light-grey-blue-background chat-app">
        <Messages messages={this.state.messages}  />

        <div className="action-bar">
          <div className="option col-xs-1 white-background">
            <span id="emoji" onClick={this.toggleEmoji} className="fa fa-smile-o light-grey"></span>
          </div>
          <textarea id="msg-input" className="input-message col-xs-10" placeholder="Your message" onKeyPress={this._onEnter} value={this.state.inputValue} onChange={this.updateInputValue}></textarea>
          <ButtonSend text={this.state.inputValue} func={this._onClick}></ButtonSend>
        </div>
      </div>
    );

    return (
      <ApolloProvider client={client}>
        <div style={style} className="text-center">
          <div className="marvel-device iphone6 silver">
              <div className="top-bar"></div>
              <div className="sleep"></div>
              <div className="volume"></div>
              <div className="camera"></div>
              <div className="sensor"></div>
              <div className="speaker"></div>
              <div className="screen">
                  {body}
              </div>
              <div className="home"></div>
              <div className="bottom-bar"></div>
          </div>
        </div>
      </ApolloProvider>
    );
  }

}

export default MainView;