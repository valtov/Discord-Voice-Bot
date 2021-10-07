const ffmpeg = require('fluent-ffmpeg');
const Bumblebee = require('bumblebee-hotword-node');
const intent = require("./dialogflow.js")
const ConvertTo1Channel = require("./stream_transformer.js")
const hotword = require("./hotword.js").HOTWORD
let detectedHotwordLast = false

async function processStream(inputStream, connection, server) {
	if ( detectedHotwordLast ) {
		console.log('Hotword detected from last audio stream')
		detectedHotwordLast = false
		const Converter = new ConvertTo1Channel()
		let s1 = inputStream.pipe(Converter)
		const sttResult = await intent.streamingDetectIntent('music-rett', 1, s1, 'AUDIO_ENCODING_LINEAR_16', 48000, 'en-US', connection, server)
		return
	}

	const bumblebee = new Bumblebee();
	bumblebee.addHotword(hotword);

	//bumblebee.setHotword('blueberry')
	//bumblebee.addHotword('bumblebee')

	const transcodedStream = new ffmpeg().input(inputStream)
	.inputOptions(['-f s16le', '-ac 2', '-ar 48000'])
	.outputOptions(['-ac 1', '-ar 16000']).format('s16le').pipe({end: false});

	let didDetectHotword = false;

	inputStream.on('end', function() {
		// the stream ends before porcupine finishes, so add a timeout
		setTimeout(function() {
			if ( !didDetectHotword ) {
				console.log('Timed out, did not detect hotword');
				//bumblebee.stop()
			}
		}, 1000);
	})

	bumblebee.on('hotword', hotword => {
		console.log('Detected hotword!');
		didDetectHotword = true;
		detectedHotwordLast = true
		const dispatcher = connection.play('./audio/UIFinal.mp3')
		//bumblebee.stop()
	});

	bumblebee.start({stream: transcodedStream});
}

//processWav('123.wav'); // should say NO
//processWav('123-bumblebee.wav'); // should say YES

exports.processStream = processStream;