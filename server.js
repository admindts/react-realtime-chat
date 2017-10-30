var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');
var env = require('node-env-file');
import { createServer } from 'http';

import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';


import { schema } from './schema';

import { execute, subscribe } from 'graphql';

import { SubscriptionServer } from 'subscriptions-transport-ws';

env(__dirname + '/.env');

var pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true
});

var app = express();

app.use(express.static(__dirname + '/build'));

app.use((req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.get('/', function(req, res) {
  res.render('index.html');
});

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
}));



// app.post('/auth', bodyParser.urlencoded({ extended: true }), function (req, res) {
//   pusher.authenticate(req, res, {
//     userID: req.query["user_id"],
//   });
// });


app.post('/messages',bodyParser.urlencoded({ extended: true }), function (req, res) {  
  try {

    pusher.trigger('messages', 'new_message', {
      'text': req.body.text, //escape text from html
      'name': req.body.name,
      'time': req.body.time
    })
    console.log("Successfully appended", req.body.text, "to the playground feed");
    // subscribe.messageAdded(req.body.text,req.body.name)
    res.sendStatus(204);
  } catch (error) {
    console.log("Error while appending to the playground feed:", error);
    res.sendStatus(500);
  }
});

var port = process.env.PORT || 4000;
// app.listen(port, function() {
//   console.log('Pusher Platform auth example listening on port ' + port);
// });

const ws = createServer(app);

ws.listen(port, () => {
  console.log(`GraphQL Server is now running on http://localhost:${port}`);

  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});