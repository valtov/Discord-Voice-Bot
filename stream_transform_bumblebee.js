const { Transform } = require('stream')
const fs = require('fs')

function convertBufferTo1Channel(buffer) {
  const convertedBuffer = Buffer.alloc(buffer.length / 2)

  var _stream = fs.createWriteStream("size.txt", {flags:'a'});
  _stream.write(buffer.length.toString());
  _stream.write("\n")
  _stream.end()
  
  for (let i = 0; i < convertedBuffer.length / 2; i++) {
    const uint16 = buffer.readUInt16LE(i * 4)
    convertedBuffer.writeUInt16LE(uint16, i * 2)
  }

  return convertedBuffer
}

class ConvertTo1Channel32BitStream extends Transform {
  constructor(source, options) {
    super(options)
  }

  _transform(data, encoding, next) {
    next(null, convertBufferTo1Channel(data))
  }
}

module.exports = ConvertTo1Channel32BitStream;