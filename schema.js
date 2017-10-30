import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `

type Message {
  name: String
  text: String
  time: String
}
# This type specifies the entry points into our API
type Query {
  messages: [Message]
}
# The mutation root type, used to define all mutations
type Mutation {
  addMessage(name: String,text: String): Message
}
# The subscription root type, specifying what we can subscribe to
type Subscription {
  messageAdded(name: String, text: String): Message
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };