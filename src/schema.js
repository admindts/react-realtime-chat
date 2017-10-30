export const typeDefs = `
type Message {
  text: String
  name: String
  time: String
}
type Query {
  messages: [Message]
}
`;