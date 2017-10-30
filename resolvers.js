import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
import faker from 'faker';

var messages = [];

function addMessage(name, text) {
    messages.push({name: name, text: text, time: '' + new Date().getTime()});
    return messages[messages.length-1];
}

function getMessages() {
    return messages;
}

addMessage('test1','text1');
addMessage('test2','text2');
addMessage('test3','text3');

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    messages: () => {
      return messages;
    }
  },
  Mutation: {
    addMessage: (root, { name, text }) => {
      let msg = {
        name: name,
        text: text,
        time: '' + new Date().getTime()
      };
      messages.push(msg);

      pubsub.publish('messageAdded', {
        messageAdded: msg
      });

      return msg;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('messageAdded'),
        (payload, variables) => {
          // The `messageAdded` channel includes events for all channels, so we filter to only
          // pass through events for the channel specified in the query
          return true;
        }
      ),
    },
  },
};