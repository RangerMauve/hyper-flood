const test = require('tape')
const hypercore = require('hypercore')
const RAM = require('random-access-memory')

const HyperFlood = require('./')
const EXTENSION_NAME = 'example'

test('Broadcast through several peers', (t) => {
  const peer1 = new hypercore(RAM)
  t.plan(2)

  peer1.ready().then(() => {
    const peer2 = new hypercore(RAM, peer1.key)
    const peer3 = new hypercore(RAM, peer1.key)

    peer2.ready().then(() => {
      peer3.ready().then(() => {
        const flood1 = new HyperFlood()
        const flood2 = new HyperFlood()
        const flood3 = new HyperFlood()

        flood1.extension(EXTENSION_NAME, peer1)
        flood2.extension(EXTENSION_NAME, peer2)
        flood3.extension(EXTENSION_NAME, peer3)

        const data = Buffer.from('Hello World')

        flood1.on('message', () => t.error('Got own message'))
        flood2.on('message', (message) => {
          t.deepEquals(message, data, 'Data got  broadcast')
        })
        flood3.on('message', (message) => {
          t.deepEquals(message, data, 'Data got  broadcast')
        })

        peer3.on('peer-add', () => {
          flood1.broadcast(data)
        })

        replicate(peer2, peer3)
        replicate(peer3, peer1)
      })
    })
  })
})

function replicate (peer1, peer2) {
  const stream1 = peer1.replicate(true)
  const stream2 = peer2.replicate(false)

  stream1.pipe(stream2)
  stream2.pipe(stream1)
}
