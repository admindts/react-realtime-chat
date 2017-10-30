import WelcomeView from './WelcomeView';
import MainView from './MainView';
import React, { Component } from 'react';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: null
    }
    this._onClick = this._onClick.bind(this);
    this._onName = this._onName.bind(this);
  }

  // getInitialState() {
  //   return {
  //     name: null
  //   };
  // }

  _onClick(){
    var input = document.getElementById('input-name');
    var name = input.value;
    this.setState({name: name});
  }

  _onName(e){
    if (e.nativeEvent.keyCode != 13) return;
    var name = e.target.value;
    this.setState({name: name});
  }

  render() {
    return (
      <div>
        <WelcomeView name={this.state.name} _onClick={this._onClick} _onName={this._onName} />
        <MainView name={this.state.name} />
      </div>
    );
  }

}
export default Chat;
// React.render(<Chat />, document.getElementById('app'));