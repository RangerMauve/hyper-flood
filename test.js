const test = require('tape')
const hypercore = require('hypercore')
const RAM = require('random-access-memory')

const HyperFlood = require('./')
const EXTENSION_NAME = 'example'

test('Broadcast through several peers', (t) => {
  const peer1 = hypercore(RAM)
  t.plan(2)

  peer1.ready(() => {
    const peer2 = hypercore(RAM, peer1.key)
    const peer3 = hypercore(RAM, peer1.key)

    peer2.ready(() => {
      peer3.ready(() => {
        const flood1 = new HyperFlood()
        const flood2 = new HyperFlood()
        const flood3 = new HyperFlood()

        peer1.registerExtension(EXTENSION_NAME, flood1.extension())
        peer2.registerExtension(EXTENSION_NAME, flood2.extension())
        peer3.registerExtension(EXTENSION_NAME, flood3.extension())

        const data = Buffer.from('Hello World')

        flood1.on('message', () => t.error('Got own message'))
        flood2.on('message', (message) => {
          t.deepEquals(message, data, 'Data got  broadcast')
        })
        flood3.on('message', (message) => {
          t.deepEquals(message, data, 'Data got  broadcast')
        })

        peer3.on('peer-open', () => {
          flood1.broadcast(data)
        })

        replicate(peer2, peer3)
        replicate(peer3, peer1)
      })
    })
  })
})

function replicate (peer1, peer2) {
  const stream1 = peer1.replicate(true, { ack: true, live: true })
  const stream2 = peer2.replicate(false, { ack: true, live: true })

  stream1.pipe(stream2)
  stream2.pipe(stream1)
}
