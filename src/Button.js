import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

// A mutation is made available on a callback called `mutate`
// Other props of the wrapping component are passed through.
function ButtonSend({ mutate, text, func }) {
    function t() {
        console.log(func);
        func();
    }
  return (
    <div className="option col-xs-1 green-background send-message" onClick={(props) => mutate({ variables: { text }  }) && t()}>
        <span className="white light fa fa-paper-plane-o"></span>
    </div>
  );
}

// You can also use `graphql` for GraphQL mutations
export default graphql(gql`
  mutation addMessage($text: String) {
    addMessage(text: $text, name: "name") {
      name
      text
    }
  }
`, {options: (props) => ({variables: {text: props.text, func: props.func}})})(ButtonSend);