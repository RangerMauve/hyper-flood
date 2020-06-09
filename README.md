# hyper-flood
Flooding broadcast using hypercore-protocol extensions

```
npm i --save hyper-flood
```

```js
const HyperFlood = require('hyper-flood')

const feed = hypercore()

const flood = new HyperFlood()

feed.registerExtension('example', flood.extension())

flood.on('message', (message) => console.log(message.toString('utf8')))

feed.on('peer-open', () => {
	flood.broadcast(Buffer.from('Hello World!'))
})
```

## How it works

This uses hypercore-protocol extension messages to broadcast messages throughout a network using [flooding](https://en.wikipedia.org/wiki/Flooding_(computer_networking)).
Each message gets tagged with a unique ID and peers will pass on any messages they see, and ignore messages they've already seen.
There's also a TTL (defaults to 255) if you want to limit how far it travlls.
Interally, there's an LRU that remembers the l

## API

### `const flood = new HyperFlood({id, lruSize, ttl, messageNumber})`

Creates a new instance of a flood. All configs are optional

- `id` is a `Buffer` with some sort of unique identifier. This gets randomly generated if not provided.
- `lruSize` is how many message IDs should be remembered at a time to avoid duplicates. Defaults to `255`
- `ttl` is the number of hops a message can travel before it'll get ignored, defaults to `255`
- `messageNumber` is the message index to start with. Defaults to `0`. Not sure why you'd set this.

### `flood.on('message', (message, originId, messageNumber) => whatever)`

You can listen on messages that show up through the flood with this event.

- `message` is a `Buffer` for the message that got sent.
- `originId` is the `id` of the peer this message originated from (no guarantee it's them)
- `messageNumber` is the message index for this message from this peer.

### `flood.on('error', (err) => whatever)`

This gets emitted when there's an error, usually while parsing the message data.

### `flood.broadcast(message, ttl)`

Use this to broadcast out messages into the network.

- `message` should be a `Buffer` to send out to the swarm.
- `ttl` is optional and will use the TTL specified in the constructor by default. This specifies the number of hops a message will be re-broascasted between peers. Set this to `0` to only reach peers you're directly connected to.

### `const extensionHandlers = flood.extension()`

This will create extension handlers for use in hypercore-protocol.

- `extensionHandlers` should be passed to `protocol.registerExtension` or `feed.registerExtension`.

---

## Credits

Ce logiciel a été créé dans le cadre du projet de plateforme virtuelle de création autochtone P2P Natakanu. Une réalisation de Wapikoni Mobile, Uhu Labos Nomades et du Bureau de l'engagement communautaire de l'université Concordia. Projet financé dans le cadre de l'Entente sur le développement culturel de Montréal conclue entre la Ville de Montréal et gouvernement du Québec.

---

This software was created as part of Natakanu, a P2P indigenous  platform produced by Wapikoni Mobile, Uhu Labos Nomades and the Office of Community Engagement at Concordia University. Project funded under the Montreal cultural development agreement between the city of Montreal and the government of Quebec.

<img src="quebec.png" width="395" alt="Quebec Province Logo" />
<img src="montreal.jpg" width="395" alt="Montreal City Logo" />
