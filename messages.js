// This file is auto generated by the protocol-buffers compiler

/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-redeclare */
/* eslint-disable camelcase */

// Remember to `npm install --save protocol-buffers-encodings`
var encodings = require('protocol-buffers-encodings')
var varint = encodings.varint
var skip = encodings.skip

var Packet = exports.Packet = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

definePacket()

function definePacket () {
  Packet.encodingLength = encodingLength
  Packet.encode = encode
  Packet.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (!defined(obj.originId)) throw new Error("originId is required")
    var len = encodings.bytes.encodingLength(obj.originId)
    length += 1 + len
    if (!defined(obj.messageNumber)) throw new Error("messageNumber is required")
    var len = encodings.varint.encodingLength(obj.messageNumber)
    length += 1 + len
    if (!defined(obj.ttl)) throw new Error("ttl is required")
    var len = encodings.varint.encodingLength(obj.ttl)
    length += 1 + len
    if (!defined(obj.data)) throw new Error("data is required")
    var len = encodings.bytes.encodingLength(obj.data)
    length += 1 + len
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (!defined(obj.originId)) throw new Error("originId is required")
    buf[offset++] = 10
    encodings.bytes.encode(obj.originId, buf, offset)
    offset += encodings.bytes.encode.bytes
    if (!defined(obj.messageNumber)) throw new Error("messageNumber is required")
    buf[offset++] = 16
    encodings.varint.encode(obj.messageNumber, buf, offset)
    offset += encodings.varint.encode.bytes
    if (!defined(obj.ttl)) throw new Error("ttl is required")
    buf[offset++] = 24
    encodings.varint.encode(obj.ttl, buf, offset)
    offset += encodings.varint.encode.bytes
    if (!defined(obj.data)) throw new Error("data is required")
    buf[offset++] = 34
    encodings.bytes.encode(obj.data, buf, offset)
    offset += encodings.bytes.encode.bytes
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      originId: null,
      messageNumber: 0,
      ttl: 0,
      data: null
    }
    var found0 = false
    var found1 = false
    var found2 = false
    var found3 = false
    while (true) {
      if (end <= offset) {
        if (!found0 || !found1 || !found2 || !found3) throw new Error("Decoded message is not valid")
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.originId = encodings.bytes.decode(buf, offset)
        offset += encodings.bytes.decode.bytes
        found0 = true
        break
        case 2:
        obj.messageNumber = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        found1 = true
        break
        case 3:
        obj.ttl = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        found2 = true
        break
        case 4:
        obj.data = encodings.bytes.decode(buf, offset)
        offset += encodings.bytes.decode.bytes
        found3 = true
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defined (val) {
  return val !== null && val !== undefined && (typeof val !== 'number' || !isNaN(val))
}
