# Pusher & React Real-Time Chat App

This is an example chat application using React for a componentised UI and Pusher for real-time chat messages.

The UI components can be found in `static/javascripts/ui_components`.

The back-end uses Node.js and can be found in `server.js`.

## Update

We've added Apollo server in backend (nodejs) and added apollo client in front (react). 

Instruction to run the application

* Create .env file with pusher app details as described
* 
```bash
$ npm install
```
* Start the server, using

```bash
$ ./node_modules/.bin/babel-node --presets node6 ./server.js
```
* start the client by
```bash
$ npm start
```
* visit the site at http://localhost:3000/

## Project Test Criteria

For this test project, you will modify this sample project to be written in Apollo instead of plain React. The chat websockets will be powered by Pusher.com.

For more information using Apollo subscriptions please read:
http://dev.apollodata.com/react/subscriptions.html

**Time limit:**
2 hours

**Finished project:**
Clone this repo and provide a link to the final solution

## Example Tutorial

There is a full tutorial on [building a real-time chat application with React and Pusher](https://blog.pusher.com/making-reactjs-realtime-with-websockets/) available.

You can see a demo here: http://pusher-chat-demo.herokuapp.com/

## Running the App

You'll need a Pusher account, so [signup for a free account](https://pusher.com/signup).

```bash
$ npm install
```

As per: https://pusher.com/docs/server_api_guide/interact_rest_api#publishing-events

Prior to running the node app you'll need some environmental variables to be set.

* `PUSHER_CHAT_APP_ID` - your Pusher application ID
* `PUSHER_CHAT_APP_KEY` - your Pusher application key
* `PUSHER_CHAT_APP_SECRET` - your Pusher application secret
* `PUSHER_CLUSTER` - your Pusher cluster


Setting these values in a `.env` file:

```
PUSHER_CLUSTER=xxx
PUSHER_APP_ID=xxx
PUSHER_APP_KEY=xxxx
PUSHER_APP_SECRET=xxx
```

Then running:

```bash
$ node server.js
```