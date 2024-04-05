import Paho, { MQTTError, Message } from 'paho-mqtt';
import events from 'events';
import { OnEventKeys, OnEventValues } from './types';
import { api } from '~/api';
import { storage } from '~/services/mmkv';

//create an object of EventEmitter class by using above reference
const em = new events.EventEmitter();
async function refreshToken() {
  await api.auth.refreshAccessToken();
}

refreshToken(); // ensures we have a valid token

const subscribedTopics: string[] = [];

const { accessToken } = storage.auth.getUserTokens();
const user = storage.auth.getUser();
const client_id = `mobileapp:${user?.id}:${Math.random().toString(36).slice(2, 7)}`; // client_type + user_id + random

// Create a client instance
let wsclient = new Paho.Client('ws-dev-002.chattersocial.io', 8083, '/ws', client_id);

// set callback handlers
wsclient.onConnectionLost = onConnectionLost;
wsclient.onMessageArrived = onMessageArrived;

const options: Paho.ConnectionOptions = {
  userName: user?.id.toString(),
  password: accessToken,
  useSSL: false,
  onSuccess: onConnect,
  onFailure: (e) => {
    console.log('error', e);
  },
};

/**
 * Connects the client to the Chatter websocket server (EMQX).
 */
function connect() {
  wsclient.isConnected() ? (wsclient.disconnect(), wsclient.connect(options)) : wsclient.connect(options);
}

function disconnect() {
  wsclient.isConnected() ? wsclient.disconnect() : null;
  console.log(`[Chatter-Websocket]: Disconnected from server.`);
}

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log(`[Chatter-Websocket]: Connected to server. (Client-ID): ${wsclient.clientId} (Server): ${wsclient.host}`);

  //////////////////////////////////////////////////////////
  // Global Subscriptions
  //////////////////////////////////////////////////////////

  // Subscribe to new platform user notifications
  client.subscribe('user/' + user?.id + '/notification');
  client.subscribe(`direct-message/${user?.id}`);

  em.emit('connect', 'Connected to server');
}

// called when the client loses its connection
// ask Justin before modifying this function, as it's used to track listener state on the backend.
function onConnectionLost(responseObject: MQTTError) {
  if (responseObject.errorCode === 0) {
    return;
  }

  if (responseObject.errorCode !== 0) {
    console.log(`[Chatter-Websocket]: Connection Lost: ${responseObject.errorMessage}`);
  }
  wsclient = new Paho.Client(
    'ws-dev-002.chattersocial.io',
    8083,
    '/ws',
    `mobileapp:${user?.id}:${Math.random().toString(36).slice(2, 7)}`,
  );
  wsclient.onConnectionLost = onConnectionLost;
  wsclient.onMessageArrived = onMessageArrived;
  wsclient.connect(options);
  setTimeout(() => {
    for (const topic of subscribedTopics) {
      console.log(`[Chatter Websocket]: Re-subscribing to topic: ${topic}`);
      wsclient.subscribe(topic);
    }
  }, 2000);
  em.emit('ConnectionLost', {
    service: 'websocket',
    event: 'onConnectionLost',
    topic: 'global',
  });
}

// called when a message arrives
function onMessageArrived(message: Message) {
  // this is where we filter out the message types and emit them
  if (message.destinationName.includes('room/') && message.destinationName.includes('/chat')) {
    em.emit('message', {
      topic: message.destinationName,
      content: JSON.parse(message.payloadString),
    });
  }

  if (message.destinationName.includes('room/') && message.destinationName.includes('/events')) {
    const payload = JSON.parse(message.payloadString);
    em.emit(payload.event, payload);
  }

  if (message.destinationName == 'user/' + user?.id + '/notification') {
    em.emit('notification', {
      service: 'notification',
      event: 'new_notification',
      topic: message.destinationName,
      content: JSON.parse(message.payloadString),
    });
  }

  if (message.destinationName == 'direct-message/' + user?.id) {
    em.emit('direct-message', {
      topic: message.destinationName,
      content: JSON.parse(message.payloadString),
    });
  }
}

function on<T extends OnEventKeys>(event: T, callback: OnEventValues<T>) {
  em.on(event, callback);
}

function off<T extends OnEventKeys>(event: T, callback: OnEventValues<T>) {
  em.removeListener(event, callback);
}

export const client = {
  connect,
  on,
  off,
  publish: (topic: string, message: any) => {
    const msg = new Paho.Message(JSON.stringify(message));
    msg.destinationName = topic;
    console.log(msg, 'sent message');

    wsclient.send(msg);
  },
  subscribe: (topic: string) => {
    console.log(`[Chatter Websocket]: Subscribing to topic: ${topic}`);
    subscribedTopics.push(topic);
    wsclient.subscribe(topic);
  },
  unsubscribe: (topic: string) => {
    console.log(`[Chatter Websocket]: Unsubscribing from topic: ${topic}`);
    wsclient.unsubscribe(topic);
    subscribedTopics.splice(subscribedTopics.indexOf(topic), 1);
  },
  disconnect,
};
