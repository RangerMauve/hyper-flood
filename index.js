const EventEmitter = require('events')
const crypto = require('crypto')

const LRU = require('lru')
const debug = require('debug')('hyper-flood')

const { Packet } = require('./messages.js')

const LRU_SIZE = 255
const TTL = 255

module.exports = class HyperFlood extends EventEmitter {
  constructor ({
    lruSize = LRU_SIZE,
    ttl = TTL,
    messageNumber = 0,
    id = crypto.randomBytes(32)
  } = {}) {
    super()

    this.id = id
    this.ttl = ttl
    this.messageNumber = messageNumber
    this.lru = new LRU(lruSize)
  }

  _handleMessage ({ originId, messageNumber, ttl, data }) {
    // Ignore messages from ourselves
    if (originId.equals(this.id)) { return debug('Got message from self', originId, messageNumber) }

    // Ignore messages we've already seen
    const key = originId.toString('hex') + messageNumber
    if (this.lru.get(key)) {
      return debug(
        'Got message that was already seen',
        originId,
        messageNumber
      )
    }
    this.lru.set(key, true)

    this.emit('message', data, originId, messageNumber)

    if (ttl <= 0) {
      return debug(
        'Got message at end of TTL',
        originId,
        messageNumber,
        ttl
      )
    }

    this._ext.broadcast({
      originId,
      messageNumber,
      data,
      ttl: ttl - 1
    })
  }

  extension (extension, feed) {
    this._ext = feed.registerExtension(extension, {
      encoding: Packet,
      onmessage: (msg, peer) => this._handleMessage(msg, peer),
      onerror: (err) => this.emit('error', err)
    })
  }

  broadcast (data, ttl = this.ttl) {
    if (!this._ext) return debug('Broadcasting without extension')
    this.messageNumber++
    const { id, messageNumber } = this

    const sendMethod = this._ext.broadcast ? 'broadcast' : 'send'

    this._ext[sendMethod]({
      originId: id,
      messageNumber,
      ttl,
      data
    })
  }
}
